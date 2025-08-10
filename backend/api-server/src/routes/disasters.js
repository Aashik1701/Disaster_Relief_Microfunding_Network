const express = require('express');
const router = express.Router();
const disasterController = require('../controllers/disasterController');
const { requireAuth, requireRole, requirePermission } = require("../middleware/auth");
const validation = require('../middleware/validation');

// Get all disasters
router.get('/', disasterController.getAllDisasters);

// Get disaster by ID
router.get('/:id', disasterController.getDisasterById);

// Create new disaster (admin only)
router.post('/', 
  requireRole(["admin"]),
  validation.createDisaster,
  disasterController.createDisaster
);

// Update disaster status
router.patch('/:id/status',
  requireRole(["admin"]),
  validation.updateDisasterStatus,
  disasterController.updateDisasterStatus
);

// Get disaster statistics
router.get('/:id/stats', disasterController.getDisasterStats);

// Get disaster transactions
router.get('/:id/transactions', disasterController.getDisasterTransactions);

module.exports = router;