const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Send email notification
router.post('/email', 
  auth.requireAdmin,
  notificationController.sendEmail
);

// Send SMS notification
router.post('/sms', 
  auth.requireAdmin,
  notificationController.sendSMS
);

// Get notification logs
router.get('/logs', 
  auth.requireAdmin,
  notificationController.getNotificationLogs
);

module.exports = router;