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

// Voucher validation
const issueVoucher = [
  body('beneficiary').isEthereumAddress().withMessage('Invalid beneficiary wallet address'),
  body('disasterZoneId').isInt().withMessage('Disaster zone ID must be an integer'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('allowedCategories').isArray().withMessage('Allowed categories must be an array'),
  body('expiryTime').isISO8601().withMessage('Expiry time must be a valid date'),
  body('recipientId').optional().isInt().withMessage('Recipient ID must be an integer')
];

const redeemVoucher = [
  param('id').isInt().withMessage('Voucher ID must be an integer'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('ipfsProofHash').notEmpty().withMessage('IPFS proof hash is required'),
  body('latitude').isFloat().withMessage('Latitude must be a number'),
  body('longitude').isFloat().withMessage('Longitude must be a number'),
  body('description').optional().isString().withMessage('Description must be a string')
];

// Proof of Aid validation
const submitProof = [
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('items').optional().isArray().withMessage('Items must be an array'),
  body('location').optional().isObject().withMessage('Location must be an object'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object')
];

const verifyProof = [
  param('id').isInt().withMessage('Proof ID must be an integer'),
  body('verified').isBoolean().withMessage('Verified must be a boolean'),
  body('verificationNotes').optional().isString().withMessage('Verification notes must be a string'),
  body('verifierComments').optional().isString().withMessage('Verifier comments must be a string')
];

// Auth validation
const walletLogin = [
  body('walletAddress').isEthereumAddress().withMessage('Invalid wallet address'),
  body('signature').notEmpty().withMessage('Signature is required')
];

const registration = [
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('walletAddress').optional().isEthereumAddress().withMessage('Invalid wallet address')
];

const login = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

// Pagination validation
const pagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// Generic ID validation
const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

const validateAddress = [
  param('address').isEthereumAddress().withMessage('Invalid wallet address')
];

module.exports = {
  createDisaster,
  updateDisasterStatus,
  registerVendor,
  createTransaction,
  issueVoucher,
  redeemVoucher,
  submitProof,
  verifyProof,
  walletLogin,
  registration,
  login,
  pagination,
  validateId,
  validateAddress
};