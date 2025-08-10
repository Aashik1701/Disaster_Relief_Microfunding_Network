const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { requireAuth, requireRole, requirePermission } = require("../middleware/auth");

// Send email notification
router.post('/email', 
  requireRole(["admin"]),
  notificationController.sendEmail
);

// Send SMS notification
router.post('/sms', 
  requireRole(["admin"]),
  notificationController.sendSMS
);

// Get notification logs
router.get('/logs', 
  requireRole(["admin"]),
  notificationController.getNotificationLogs
);

module.exports = router;