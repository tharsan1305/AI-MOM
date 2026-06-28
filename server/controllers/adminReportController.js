const User = require('../models/User');
const Image = require('../models/Image');
const ApiCostTracking = require('../models/ApiCostTracking');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

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
    const costs = await ApiCostTracking.find().populate('userId', 'name email').lean();
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('AI Costs');
    
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'User', key: 'user', width: 25 },
      { header: 'Provider', key: 'provider', width: 15 },
      { header: 'Model', key: 'model', width: 15 },
      { header: 'Cost (USD)', key: 'cost', width: 15 },
      { header: 'Gen Time (ms)', key: 'time', width: 15 }
    ];

    costs.forEach(c => {
      worksheet.addRow({
        date: c.createdAt.toISOString().split('T')[0],
        user: c.userId ? c.userId.email : 'Unknown',
        provider: c.provider,
        model: c.model,
        cost: c.estimatedCostUsd,
        time: c.generationTimeMs
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'ai_analytics_report.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { exportUsersReport, exportPromptsReport, exportAnalyticsExcel };
