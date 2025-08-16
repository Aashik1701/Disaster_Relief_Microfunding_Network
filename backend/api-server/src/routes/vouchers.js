const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { requireAuth, requireRole, requirePermission } = require('../middleware/auth');
const validation = require('../middleware/validation');

// All voucher routes require authentication
router.use(requireAuth);

// Get all vouchers (admin, government, treasury only)
router.get('/', 
  requireRole(['admin', 'government', 'treasury']), 
  voucherController.getAllVouchers
);

// Get voucher by ID
router.get('/:id', 
  voucherController.getVoucherById
);

// Issue new voucher (admin, government only)
router.post('/', 
  requireRole(['admin', 'government']),
  validation.issueVoucher || [],
  voucherController.issueVoucher
);

// Redeem voucher (vendor only)
router.post('/:id/redeem', 
  requireRole(['vendor']),
  validation.redeemVoucher || [],
  voucherController.redeemVoucher
);

// Validate voucher (vendor only - for pre-redemption check)
router.get('/:id/validate', 
  requireRole(['vendor']), 
  voucherController.validateVoucher
);

// Get user's vouchers
router.get('/user/:address', 
  voucherController.getUserVouchers
);

// Get voucher statistics for a disaster zone
router.get('/zone/:zoneId/stats', 
  requireRole(['admin', 'government', 'treasury']), 
  voucherController.getZoneVoucherStats
);

module.exports = router;
