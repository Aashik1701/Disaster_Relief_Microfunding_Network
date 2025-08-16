const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { requireAuth, requireRole, requirePermission } = require('../middleware/auth');

// All analytics routes require authentication
router.use(requireAuth);

// Dashboard analytics - role-based access
router.get('/dashboard', 
  requireRole(['admin', 'government', 'treasury', 'vendor', 'victim', 'donor']), 
  analyticsController.getDashboardStats
);

// Global funding statistics
router.get('/funding', 
  requireRole(['admin', 'government', 'treasury', 'donor']), 
  analyticsController.getFundingStats
);

// Geographic distribution of aid
router.get('/geographic', 
  requireRole(['admin', 'government', 'treasury']), 
  analyticsController.getGeographicStats
);

// Impact metrics
router.get('/impact', 
  requireRole(['admin', 'government', 'treasury', 'donor']), 
  analyticsController.getImpactMetrics
);

router.get('/impact/:zoneId', 
  requireRole(['admin', 'government', 'treasury', 'donor']), 
  analyticsController.getImpactMetrics
);

// User statistics by role (admin only)
router.get('/users/roles', 
  requireRole(['admin']), 
  analyticsController.getUserStatsByRole
);

module.exports = router;
