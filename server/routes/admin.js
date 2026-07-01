const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminAuthController');

// Public route for admin login
router.post('/login', adminLogin);

const { adminAuth } = require('../middleware/adminAuth');
const { getDashboardStats } = require('../controllers/adminDashboardController');
const { getUsers, updateUser, bulkUpdateUsers, deleteUser, bulkDeleteUsers, resetUserPassword, getUserDetails } = require('../controllers/adminUserController');
const { getPrompts, deletePrompt } = require('../controllers/adminPromptController');
const { getSettings, updateSettings } = require('../controllers/adminSettingsController');
const { getNotifications, markAsRead, createBroadcast } = require('../controllers/adminNotificationController');
const { getTickets, updateTicket, replyToTicket } = require('../controllers/adminSupportController');
const { auditLogMiddleware } = require('../middleware/auditLog');
const { getSystemStatus } = require('../controllers/adminSystemController');
const { exportUsersReport, exportPromptsReport, exportAnalyticsExcel, exportUserPDF, exportAllUsersPDF } = require('../controllers/adminReportController');
const { getCompleteAnalytics } = require('../controllers/adminAnalyticsController');
const { getProviders, updateProvider, activateProvider, testProvider } = require('../controllers/adminProviderController');
const { getGeneratedReports } = require('../controllers/adminGeneratedReportsController');
const { getAuditLogs } = require('../controllers/adminAuditLogController');

// All routes below this line require admin role
router.use(adminAuth);
router.use(auditLogMiddleware);

// AI Analytics
router.get('/analytics/full', getCompleteAnalytics);

// Reports
router.get('/reports/users', exportUsersReport);
router.get('/reports/users-pdf', exportAllUsersPDF);
router.get('/reports/users/:id/pdf', exportUserPDF);
router.get('/reports/prompts', exportPromptsReport);
router.get('/reports/analytics-excel', exportAnalyticsExcel);

// System Monitoring
router.get('/system', getSystemStatus);

// Dashboard & Analytics
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.get('/users/:id/details', getUserDetails);
router.put('/users/bulk', bulkUpdateUsers);
router.delete('/users/bulk', bulkDeleteUsers);
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



// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markAsRead);
router.post('/notifications/broadcast', createBroadcast);

// Support Tickets
router.get('/support', getTickets);
router.put('/support/:id', updateTicket);
router.post('/support/:id/reply', replyToTicket);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;
