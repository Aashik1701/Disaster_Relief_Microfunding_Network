const dataService = require('../services/dataService');
const { body, validationResult } = require('express-validator');

class UserController {
  // Get all users with pagination and filtering
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, role, status, search } = req.query;
      
      const options = {
        page: parseInt(page),
        limit: Math.min(parseInt(limit), 100), // Max 100 per page
        role: role || undefined,
        status: status || undefined
      };
      
      const users = await dataService.getUsers(options);
      
      res.json({
        success: true,
        data: users,
        pagination: {
          page: options.page,
          limit: options.limit,
          total: users.length
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await dataService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  }

  // Get user by wallet address
  async getUserByWallet(req, res) {
    try {
      const { walletAddress } = req.params;
      
      // Validate wallet address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid wallet address format'
        });
      }
      
      const user = await dataService.getUserByWallet(walletAddress);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching user by wallet:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  }

  // Create new user
  async createUser(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const userData = req.body;
      
      // Check if user already exists
      const existingUser = await dataService.getUserByWallet(userData.walletAddress);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this wallet address already exists'
        });
      }
      
      // Audit data for logging
      const auditData = {
        userId: req.user?.id,
        walletAddress: req.user?.walletAddress,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      };
      
      const user = await dataService.createUser(userData, auditData);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user.toSafeJSON()
      });
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Handle specific database errors
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(e => ({
            field: e.path,
            message: e.message
          }))
        });
      }
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'User with this wallet address or email already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const { id } = req.params;
      const updates = req.body;
      
      // Check if user exists
      const existingUser = await dataService.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check permissions (users can only update themselves unless admin)
      if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      // Don't allow role changes unless admin
      if (updates.role && req.user.role !== 'admin') {
        delete updates.role;
      }
      
      // Audit data for logging
      const auditData = {
        userId: req.user?.id,
        walletAddress: req.user?.walletAddress,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      };
      
      const updatedUser = await dataService.updateUser(id, updates, auditData);
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser.toSafeJSON()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(e => ({
            field: e.path,
            message: e.message
          }))
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await dataService.getUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
      }
      
      res.json({
        success: true,
        data: user.toSafeJSON()
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
        error: error.message
      });
    }
  }

  // Update current user profile
  async updateProfile(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }
      
      const updates = req.body;
      
      // Don't allow role or status changes through profile update
      delete updates.role;
      delete updates.status;
      delete updates.verificationStatus;
      delete updates.walletAddress; // Wallet address is immutable
      
      // Audit data for logging
      const auditData = {
        userId: req.user.id,
        walletAddress: req.user.walletAddress,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      };
      
      const updatedUser = await dataService.updateUser(req.user.id, updates, auditData);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser.toSafeJSON()
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }

  // Get user statistics by role
  async getUserStats(req, res) {
    try {
      const stats = await dataService.getUserStatsByRole();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user statistics',
        error: error.message
      });
    }
  }

  // Get user audit history
  async getUserAuditHistory(req, res) {
    try {
      const { id } = req.params;
      const { limit = 50 } = req.query;
      
      // Check permissions
      if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      const auditHistory = await dataService.getUserAuditHistory(id, parseInt(limit));
      
      res.json({
        success: true,
        data: auditHistory
      });
    } catch (error) {
      console.error('Error fetching user audit history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch audit history',
        error: error.message
      });
    }
  }
}

// Validation middleware
const createUserValidation = [
  body('walletAddress')
    .isLength({ min: 42, max: 42 })
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Valid wallet address is required'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('role')
    .isIn(['admin', 'donor', 'victim', 'vendor', 'government', 'treasury', 'oracle'])
    .withMessage('Valid role is required')
];

const updateUserValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('role')
    .optional()
    .isIn(['admin', 'donor', 'victim', 'vendor', 'government', 'treasury', 'oracle'])
    .withMessage('Valid role is required'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'pending', 'suspended'])
    .withMessage('Valid status is required')
];

const updateProfileValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required')
];

module.exports = {
  UserController: new UserController(),
  createUserValidation,
  updateUserValidation,
  updateProfileValidation
};
