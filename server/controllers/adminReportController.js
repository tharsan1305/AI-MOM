const User = require('../models/User');
const Image = require('../models/Image');
const ApiCostTracking = require('../models/ApiCostTracking');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// @desc    Export Users Report
// @route   GET /api/admin/reports/users
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select('name email role status plan promptsToday totalPrompts createdAt lastLogin').lean();
    
    const fields = ['name', 'email', 'role', 'status', 'plan', 'promptsToday', 'totalPrompts', 'createdAt', 'lastLogin'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(users);

    res.header('Content-Type', 'text/csv');
    res.attachment('users_report.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export Prompts Report
// @route   GET /api/admin/reports/prompts
const exportPromptsReport = async (req, res) => {
  try {
    const prompts = await Image.find().populate('userId', 'email').lean();
    
    // Flatten data for CSV
    const data = prompts.map(p => ({
      prompt: p.prompt,
      userEmail: p.userId ? p.userId.email : 'Unknown',
      model: p.model,
      size: p.size,
      createdAt: p.createdAt
    }));

    const fields = ['prompt', 'userEmail', 'model', 'size', 'createdAt'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('prompts_report.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export Cost Analytics as Excel
// @route   GET /api/admin/reports/analytics-excel
const exportAnalyticsExcel = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    
    // Summary Data
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Value', key: 'value', width: 20 }
    ];
    
    const [costs, images, errorStats] = await Promise.all([
      ApiCostTracking.aggregate([
        { $group: { _id: null, totalCost: { $sum: '$estimatedCostUsd' }, totalRequests: { $sum: 1 }, totalTokens: { $sum: '$totalTokens' } } }
      ]),
      Image.countDocuments(),
      ErrorLog.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }])
    ]);
    
    summarySheet.addRows([
      { metric: 'Total API Cost', value: costs[0]?.totalCost || 0 },
      { metric: 'Total Requests', value: costs[0]?.totalRequests || 0 },
      { metric: 'Total Tokens', value: costs[0]?.totalTokens || 0 },
      { metric: 'Total Images', value: images }
    ]);

    // Provider Performance
    const providerSheet = workbook.addWorksheet('Providers');
    providerSheet.columns = [
      { header: 'Provider', key: 'provider', width: 20 },
      { header: 'Requests', key: 'requests', width: 15 },
      { header: 'Total Cost', key: 'cost', width: 15 },
      { header: 'Success %', key: 'success', width: 15 }
    ];
    
    const providers = await ApiCostTracking.aggregate([
      { $group: { _id: '$provider', requests: { $sum: 1 }, cost: { $sum: '$estimatedCostUsd' }, success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } } } }
    ]);
    
    providers.forEach(p => {
      providerSheet.addRow({
        provider: p._id,
        requests: p.requests,
        cost: p.cost.toFixed(4),
        success: p.requests > 0 ? ((p.success / p.requests) * 100).toFixed(2) + '%' : '0%'
      });
    });

    // Detailed Cost Tracking
    const costSheet = workbook.addWorksheet('Cost Analytics');
    costSheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'User Email', key: 'user', width: 25 },
      { header: 'Provider', key: 'provider', width: 15 },
      { header: 'Model', key: 'model', width: 15 },
      { header: 'Total Tokens', key: 'tokens', width: 15 },
      { header: 'Cost (USD)', key: 'cost', width: 15 },
      { header: 'Time (ms)', key: 'time', width: 15 }
    ];
    
    const detailedCosts = await ApiCostTracking.find().populate('userId', 'email').sort({ createdAt: -1 }).limit(1000).lean();
    detailedCosts.forEach(c => {
      costSheet.addRow({
        date: c.createdAt.toISOString().split('T')[0],
        user: c.userId ? c.userId.email : 'Unknown',
        provider: c.provider,
        model: c.model,
        tokens: c.totalTokens,
        cost: c.estimatedCostUsd,
        time: c.generationTimeMs
      });
    });
    
    // Errors
    const errorSheet = workbook.addWorksheet('Errors');
    errorSheet.columns = [
      { header: 'Error Type', key: 'type', width: 25 },
      { header: 'Count', key: 'count', width: 15 }
    ];
    errorStats.forEach(e => {
      errorSheet.addRow({ type: e._id || 'unknown', count: e.count });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'ai_analytics_report.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export User PDF
// @route   GET /api/admin/reports/users/:id/pdf
const exportUserPDF = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=user_profile_${user._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('MinuteCraft User Profile Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text('Personal Information');
    doc.fontSize(10).text(`Name: ${user.name}`);
    doc.fontSize(10).text(`Email: ${user.email}`);
    doc.fontSize(10).text(`Role: ${user.role}`);
    doc.fontSize(10).text(`Plan: ${user.plan}`);
    doc.fontSize(10).text(`Status: ${user.status}`);
    doc.moveDown();

    doc.fontSize(14).text('Device & Location');
    doc.fontSize(10).text(`Device: ${user.deviceInfo?.type || 'N/A'}`);
    doc.fontSize(10).text(`OS: ${user.deviceInfo?.os || 'N/A'}`);
    doc.fontSize(10).text(`Country: ${user.location?.country || 'N/A'}`);
    doc.fontSize(10).text(`IP: ${user.location?.ip || 'N/A'}`);
    doc.moveDown();

    doc.fontSize(14).text('Usage Analytics');
    doc.fontSize(10).text(`Login Count: ${user.loginCount || 0}`);
    doc.fontSize(10).text(`AI Requests: ${user.aiRequests || 0}`);
    doc.fontSize(10).text(`Images Generated: ${user.imagesGenerated || 0}`);
    doc.fontSize(10).text(`Total Downloads: ${user.totalDownloads || 0}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export All Users PDF
// @route   GET /api/admin/reports/users-pdf
const exportAllUsersPDF = async (req, res) => {
  try {
    const users = await User.find().lean();
    
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=all_users_report.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('MinuteCraft All Users Report', { align: 'center' });
    doc.moveDown(2);
    
    users.forEach((user, index) => {
      doc.fontSize(14).text(`User: ${user.name || 'N/A'}`);
      doc.fontSize(10).text(`Email: ${user.email}`);
      doc.fontSize(10).text(`Role: ${user.role} | Plan: ${user.plan} | Status: ${user.status}`);
      doc.fontSize(10).text(`Joined: ${new Date(user.createdAt).toLocaleDateString()}`);
      doc.fontSize(10).text(`Login Count: ${user.loginCount || 0}`);
      doc.moveDown();
      
      // Add page break if it's getting too long, except for the last item
      if ((index + 1) % 5 === 0 && index !== users.length - 1) {
        doc.addPage();
      }
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { exportUsersReport, exportPromptsReport, exportAnalyticsExcel, exportUserPDF, exportAllUsersPDF };
