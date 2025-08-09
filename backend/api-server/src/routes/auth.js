const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');

// Login with wallet
router.post('/login', 
  validation.walletLogin,
  authController.walletLogin
);

// Refresh token
router.post('/refresh', 
  authController.refreshToken
);

// Logout
router.post('/logout', 
  authController.logout
);

// Verify token
router.get('/verify', 
  authController.verifyToken
);

module.exports = router;