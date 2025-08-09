const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const dataService = require('../services/dataService');

class NotificationController {
  async sendEmail(req, res) {
    try {
      const { to, subject, body, attachments } = req.body;
      
      const result = await emailService.sendEmail(to, subject, body, attachments);
      
      // Log notification
      await dataService.logNotification({
        type: 'email',
        recipient: to,
        subject,
        status: result.success ? 'sent' : 'failed',
        sentBy: req.user.id
      });
      
      res.json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async sendSMS(req, res) {
    try {
      const { to, body } = req.body;
      
      const result = await smsService.sendSMS(to, body);
      
      // Log notification
      await dataService.logNotification({
        type: 'sms',
        recipient: to,
        subject: body.substring(0, 100),
        status: result.success ? 'sent' : 'failed',
        sentBy: req.user.id
      });
      
      res.json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getNotificationLogs(req, res) {
    try {
      const { page = 1, limit = 10, type } = req.query;
      
      const logs = await dataService.getNotificationLogs({
        page: parseInt(page),
        limit: parseInt(limit),
        type
      });
      
      res.json({
        success: true,
        data: logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: logs.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new NotificationController();