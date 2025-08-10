const express = require('express');
const router = express.Router();
const { 
  UserController, 
  createUserValidation, 
  updateUserValidation, 
  updateProfileValidation 
} = require('../controllers/userController');
const { requireAuth, requireRole, requirePermission } = require('../middleware/auth');

// Public routes (minimal access)
router.get('/wallet/:walletAddress', UserController.getUserByWallet.bind(UserController));

// Protected routes (require authentication)
router.use(requireAuth);

// Profile routes (for current user)
router.get('/profile', UserController.getProfile.bind(UserController));
router.put('/profile', updateProfileValidation, UserController.updateProfile.bind(UserController));

// User management routes
router.get('/', UserController.getUsers.bind(UserController));
router.get('/stats', UserController.getUserStats.bind(UserController));
router.get('/:id', UserController.getUserById.bind(UserController));
router.get('/:id/audit', UserController.getUserAuditHistory.bind(UserController));

// Admin only routes
router.post('/', requireRole(['admin']), createUserValidation, UserController.createUser.bind(UserController));
router.put('/:id', requireRole(['admin']), updateUserValidation, UserController.updateUser.bind(UserController));

module.exports = router;
