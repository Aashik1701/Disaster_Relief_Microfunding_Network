const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const { requireAuth, requireRole, requirePermission } = require("../middleware/auth");

// All audit routes require authentication
router.use(requireAuth);

// Get audit logs (admin and treasury only)
router.get('/', requireRole(['admin', 'treasury']), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      userId, 
      action, 
      resource, 
      success,
      startDate,
      endDate
    } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 200), // Max 200 per page
      userId: userId ? parseInt(userId) : undefined,
      action,
      resource,
      success: success !== undefined ? success === 'true' : undefined
    };
    
    // Add date filtering if provided
    if (startDate || endDate) {
      options.dateRange = {
        start: startDate ? new Date(startDate) : undefined,
        end: endDate ? new Date(endDate) : undefined
      };
    }
    
    const logs = await dataService.getAuditLogs(options);
    
    res.json({
      success: true,
      data: logs,
      pagination: {
        page: options.page,
        limit: options.limit,
        total: logs.length
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
});

// Get audit logs for specific user
router.get('/user/:userId', requireRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100 } = req.query;
    
    const logs = await dataService.getUserAuditHistory(userId, parseInt(limit));
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching user audit history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user audit history',
      error: error.message
    });
  }
});

// Get audit logs for specific resource
router.get('/resource/:resource/:resourceId', requireRole(['admin', 'treasury']), async (req, res) => {
  try {
    const { resource, resourceId } = req.params;
    const { limit = 50 } = req.query;
    
    const logs = await dataService.getResourceAuditHistory(resource, resourceId, parseInt(limit));
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching resource audit history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource audit history',
      error: error.message
    });
  }
});

// Get audit statistics
router.get('/stats', requireRole(['admin']), async (req, res) => {
  try {
    const { period = 'day', days = 7 } = req.query;
    
    // This would need to be implemented in dataService
    // For now, return a simple response
    res.json({
      success: true,
      data: {
        message: 'Audit statistics endpoint - to be implemented',
        period,
        days
      }
    });
  } catch (error) {
    console.error('Error fetching audit statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit statistics',
      error: error.message
    });
  }
});

// Manual audit log entry (admin only, for special cases)
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    const {
      action,
      resource,
      resourceId,
      description,
      metadata = {}
    } = req.body;
    
    if (!action || !resource) {
      return res.status(400).json({
        success: false,
        message: 'Action and resource are required'
      });
    }
    
    const auditData = {
      userId: req.user.id,
      walletAddress: req.user.walletAddress,
      action,
      resource,
      resourceId,
      metadata: {
        ...metadata,
        manual_entry: true,
        description
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    const log = await dataService.logAction(auditData);
    
    res.status(201).json({
      success: true,
      message: 'Audit log entry created',
      data: log
    });
  } catch (error) {
    console.error('Error creating audit log entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create audit log entry',
      error: error.message
    });
  }
});

module.exports = router;
