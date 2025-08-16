const express = require('express');
const router = express.Router();
const proofController = require('../controllers/proofController');
const { requireAuth, requireRole, requirePermission } = require('../middleware/auth');
const validation = require('../middleware/validation');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  }
});

// All proof routes require authentication
router.use(requireAuth);

// Submit proof of aid (vendor only)
router.post('/', 
  requireRole(['vendor']),
  upload.array('files', 5), // Allow up to 5 file uploads
  validation.submitProof || [],
  proofController.submitProof
);

// Get all proofs (admin, government, treasury, oracle only)
router.get('/', 
  requireRole(['admin', 'government', 'treasury', 'oracle']), 
  proofController.getAllProofs
);

// Get proof by ID
router.get('/:id', 
  proofController.getProofById
);

// Verify proof (admin, oracle only)
router.patch('/:id/verify', 
  requireRole(['admin', 'oracle']),
  validation.verifyProof || [],
  proofController.verifyProof
);

// Get proofs for a specific transaction
router.get('/transaction/:transactionId', 
  proofController.getTransactionProofs
);

// Get proofs for a specific voucher
router.get('/voucher/:voucherId', 
  proofController.getVoucherProofs
);

// Get proof statistics
router.get('/stats/overview', 
  requireRole(['admin', 'government', 'treasury']), 
  proofController.getProofStats
);

// Get vendor's proof submissions
router.get('/vendor/:address', 
  requireRole(['admin', 'government', 'treasury', 'vendor']), 
  proofController.getVendorProofs
);

module.exports = router;
