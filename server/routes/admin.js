const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminAuthController');

// Public route for admin login
router.post('/login', adminLogin);

const { adminAuth } = require('../middleware/adminAuth');
const { getDashboardStats, getAnalytics } = require('../controllers/adminDashboardController');
const { getUsers, updateUser, deleteUser, resetUserPassword, getUserDetails } = require('../controllers/adminUserController');
const { getPrompts, deletePrompt } = require('../controllers/adminPromptController');
const { getSettings, updateSettings } = require('../controllers/adminSettingsController');
const { getPlans, createPlan, updatePlan, deletePlan } = require('../controllers/adminPlanController');
const { getPayments, updatePaymentStatus } = require('../controllers/adminPaymentController');
const { getNotifications, markAsRead } = require('../controllers/adminNotificationController');
const { auditLogMiddleware } = require('../middleware/auditLog');
const { getSystemStatus } = require('../controllers/adminSystemController');
const { exportUsersReport, exportPromptsReport, exportAnalyticsExcel } = require('../controllers/adminReportController');
const { getOverview, getTokenAnalytics, getProviderAnalytics, getTopicAnalytics, getCostTrends } = require('../controllers/adminAnalyticsController');
const { getProviders, updateProvider, activateProvider, testProvider } = require('../controllers/adminProviderController');
const { getGeneratedReports } = require('../controllers/adminGeneratedReportsController');
const { getSubscriptions } = require('../controllers/adminSubscriptionController');
const { getAuditLogs } = require('../controllers/adminAuditLogController');

// All routes below this line require admin role
router.use(adminAuth);
router.use(auditLogMiddleware);

// AI Analytics
router.get('/analytics/overview', getOverview);
router.get('/analytics/tokens', getTokenAnalytics);
router.get('/analytics/providers', getProviderAnalytics);
router.get('/analytics/topics', getTopicAnalytics);
router.get('/analytics/cost-trends', getCostTrends);

// Reports
router.get('/reports/users', exportUsersReport);
router.get('/reports/prompts', exportPromptsReport);
router.get('/reports/analytics-excel', exportAnalyticsExcel);

// System Monitoring
router.get('/system', getSystemStatus);

// Dashboard & Analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getUsers);
router.get('/users/:id/details', getUserDetails);
router.put('/users/:id', updateUser);
router.put('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUser);

// Prompts / Image History
router.get('/prompts', getPrompts);
router.delete('/prompts/:id', deletePrompt);

// Generated Reports
router.get('/generated-reports', getGeneratedReports);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// API Providers
router.get('/providers', getProviders);
router.put('/providers/:name', updateProvider);
router.post('/providers/:name/activate', activateProvider);
router.post('/providers/:name/test', testProvider);

// Subscriptions
router.get('/subscriptions', getSubscriptions);

// Plans
router.get('/plans', getPlans);
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

// Payments
router.get('/payments', getPayments);
router.put('/payments/:id', updatePaymentStatus);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markAsRead);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;
