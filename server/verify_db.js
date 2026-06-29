require('dotenv').config();
const mongoose = require('mongoose');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/meetgraph');
  console.log('Connected to DB');

  // 1. Dashboard: Total Reports Generated
  const Infographic = require('./models/Infographic');
  const Project = require('./models/Project'); // Assuming Infographic or Project holds reports
  
  // It seems we used Project or Infographic. Let's check both.
  const totalProjects = await Project.countDocuments();
  const totalInfographics = await Infographic.countDocuments();
  console.log('Total Projects:', totalProjects);
  console.log('Total Infographics:', totalInfographics);

  // 2. Users: Plan-change test
  const AuditLog = require('./models/AuditLog');
  const userAudit = await AuditLog.findOne({ action: 'UPDATE_USER' }).sort({ createdAt: -1 });
  if (userAudit) {
    console.log('User Plan Change Audit:', JSON.stringify(userAudit, null, 2));
  } else {
    console.log('No UPDATE_USER audit found');
  }

  // 3. Generated Reports: Exact title + timestamp
  const report = await Project.findOne().sort({ createdAt: -1 });
  if (report) {
    console.log('Latest Report Title:', report.title, 'Timestamp:', report.createdAt);
  } else {
    console.log('No reports found');
  }

  // 4. Prompt History: Raw input text
  const PromptLog = require('./models/PromptLog');
  const prompt = await PromptLog.findOne().sort({ createdAt: -1 });
  if (prompt) {
    console.log('Latest Prompt Raw Input:', prompt.rawNotes);
  } else {
    console.log('No prompt history found');
  }

  // 5. Subscriptions: Real or stubbed?
  const Subscription = require('./models/Subscription');
  const subCount = await Subscription.countDocuments();
  const sub = await Subscription.findOne().sort({ createdAt: -1 });
  console.log('Total Subscriptions:', subCount);
  if (sub) console.log('Latest Sub:', JSON.stringify(sub, null, 2));

  // 6. Payments: Real transactions?
  const Payment = require('./models/Payment');
  const payCount = await Payment.countDocuments();
  const payment = await Payment.findOne().sort({ createdAt: -1 });
  console.log('Total Payments:', payCount);
  if (payment) console.log('Latest Payment:', JSON.stringify(payment, null, 2));

  // 7. Settings: maintenance mode toggle
  const Settings = require('./models/Settings');
  const settings = await Settings.findOne();
  console.log('Settings:', JSON.stringify(settings, null, 2));

  // 8. Audit Logs: JSON diff entry
  const settingAudit = await AuditLog.findOne({ action: 'UPDATE_GLOBAL_SETTINGS' }).sort({ createdAt: -1 });
  if (settingAudit) {
    console.log('Settings Audit Diff:');
    console.log('Before:', JSON.stringify(settingAudit.beforeValue, null, 2));
    console.log('After:', JSON.stringify(settingAudit.afterValue, null, 2));
  } else {
    console.log('No settings audit found');
  }

  process.exit(0);
};

run().catch(console.error);
