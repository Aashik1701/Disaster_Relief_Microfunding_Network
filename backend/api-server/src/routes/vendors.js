const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { requireAuth, requireRole, requirePermission } = require("../middleware/auth");
const validation = require('../middleware/validation');

// Get all vendors
router.get('/', vendorController.getAllVendors);

// Get vendor by address
router.get('/:address', vendorController.getVendorByAddress);

// Register new vendor (admin only)
router.post('/', 
  requireRole(["admin"]),
  validation.registerVendor,
  vendorController.registerVendor
);

// Update vendor status
router.patch('/:address/status',
  requireRole(["admin"]),
  vendorController.updateVendorStatus
);

// Get vendor transactions
router.get('/:address/transactions', vendorController.getVendorTransactions);

module.exports = router;