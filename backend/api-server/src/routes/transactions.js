const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// Get all transactions
router.get('/', transactionController.getAllTransactions);

// Get transaction by hash
router.get('/:hash', transactionController.getTransactionByHash);

// Create new transaction
router.post('/', 
  auth.requireVendor,
  validation.createTransaction,
  transactionController.createTransaction
);

// Get transaction proof
router.get('/:hash/proof', transactionController.getTransactionProof);

module.exports = router;