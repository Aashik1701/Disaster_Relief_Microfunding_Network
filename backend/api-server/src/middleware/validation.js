const { body, param, query } = require('express-validator');

// Disaster validation
const createDisaster = [
  body('name').notEmpty().withMessage('Name is required'),
  body('latitude').isFloat().withMessage('Latitude must be a number'),
  body('longitude').isFloat().withMessage('Longitude must be a number'),
  body('radius').isInt({ min: 1 }).withMessage('Radius must be a positive integer'),
  body('initialFunding').isFloat({ min: 0 }).withMessage('Initial funding must be a positive number')
];

const updateDisasterStatus = [
  param('id').isInt().withMessage('ID must be an integer'),
  body('status').isIn(['active', 'inactive', 'completed']).withMessage('Invalid status')
];

// Vendor validation
const registerVendor = [
  body('walletAddress').isEthereumAddress().withMessage('Invalid wallet address'),
  body('name').notEmpty().withMessage('Name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('disasterZoneId').isInt().withMessage('Disaster zone ID must be an integer'),
  body('kycIpfsHash').notEmpty().withMessage('KYC IPFS hash is required')
];

// Transaction validation
const createTransaction = [
  body('voucherId').isInt().withMessage('Voucher ID must be an integer'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('ipfsHash').notEmpty().withMessage('IPFS hash is required'),
  body('latitude').isFloat().withMessage('Latitude must be a number'),
  body('longitude').isFloat().withMessage('Longitude must be a number'),
  body('category').notEmpty().withMessage('Category is required')
];

// Auth validation
const walletLogin = [
  body('walletAddress').isEthereumAddress().withMessage('Invalid wallet address'),
  body('signature').notEmpty().withMessage('Signature is required')
];

// Pagination validation
const pagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

module.exports = {
  createDisaster,
  updateDisasterStatus,
  registerVendor,
  createTransaction,
  walletLogin,
  pagination
};