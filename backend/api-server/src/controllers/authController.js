const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const dataService = require('../services/dataService');

class AuthController {
  async walletLogin(req, res) {
    try {
      const { walletAddress, signature } = req.body;
      
      // Verify signature (simplified for example)
      // In production, you should verify the signature properly
      
      // Check if user exists
      let user = await dataService.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        // Create new user
        user = await dataService.createUser({
          walletAddress,
          role: 'user'
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          walletAddress: user.walletAddress,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Generate refresh token
      const refreshToken = uuidv4();
      
      // Save refresh token
      await dataService.saveRefreshToken(user.id, refreshToken);
      
      res.json({
        success: true,
        data: {
          user,
          token,
          refreshToken
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      // Verify refresh token
      const tokenData = await dataService.getRefreshToken(refreshToken);
      
      if (!tokenData) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
      }
      
      // Get user
      const user = await dataService.getUserById(tokenData.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      // Generate new JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          walletAddress: user.walletAddress,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        data: {
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      
      // Remove refresh token
      await dataService.removeRefreshToken(refreshToken);
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      res.json({
        success: true,
        data: decoded
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  }
}

module.exports = new AuthController();