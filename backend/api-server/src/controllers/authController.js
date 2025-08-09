const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const { v4: uuidv4 } = require('uuid');
const dataService = require('../services/dataService');

// Role hierarchy and permissions (matching frontend)
const ROLE_HIERARCHY = {
  admin: 10,
  government: 8,
  treasury: 7,
  oracle: 6,
  vendor: 5,
  victim: 4,
  donor: 3,
  guest: 1
};

const ROLE_PERMISSIONS = {
  admin: [
    'manage:all',
    'view:all',
    'disaster:create',
    'disaster:update',
    'disaster:delete',
    'vendor:approve',
    'vendor:reject',
    'user:manage',
    'analytics:full',
    'system:configure'
  ],
  government: [
    'disaster:create',
    'disaster:update',
    'disaster:verify',
    'vendor:approve',
    'analytics:view',
    'reports:generate'
  ],
  treasury: [
    'funds:manage',
    'treasury:view',
    'treasury:allocate',
    'analytics:financial'
  ],
  oracle: [
    'data:verify',
    'price:update',
    'validation:perform'
  ],
  vendor: [
    'voucher:redeem',
    'inventory:manage',
    'transaction:process',
    'profile:update',
    'analytics:vendor'
  ],
  victim: [
    'voucher:claim',
    'aid:request',
    'profile:update',
    'donation:track'
  ],
  donor: [
    'donation:make',
    'impact:track',
    'profile:update',
    'analytics:donation'
  ],
  guest: [
    'public:view'
  ]
};

class AuthController {
  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        walletAddress: user.walletAddress 
      },
      process.env.JWT_SECRET || 'development-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  // Generate refresh token
  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || 'development-refresh-secret',
      { expiresIn: '7d' }
    );
  }

  // Traditional email/password registration
  async register(req, res) {
    try {
      const { 
        firstName, 
        lastName, 
        email, 
        password, 
        role = 'donor',
        organization,
        phone,
        walletAddress 
      } = req.body;

      // Validate input
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          code: 'MISSING_FIELDS'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long',
          code: 'WEAK_PASSWORD'
        });
      }

      // Validate role
      const validRoles = Object.keys(ROLE_PERMISSIONS);
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: `Invalid role. Valid roles: ${validRoles.join(', ')}`,
          code: 'INVALID_ROLE'
        });
      }

      // Check if user already exists
      const existingUser = await dataService.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists with this email',
          code: 'USER_EXISTS'
        });
      }

      // Check wallet address if provided
      if (walletAddress) {
        if (!ethers.isAddress(walletAddress)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid wallet address format',
            code: 'INVALID_WALLET_ADDRESS'
          });
        }

        const existingWallet = await dataService.getUserByWalletAddress(walletAddress);
        if (existingWallet) {
          return res.status(409).json({
            success: false,
            error: 'Wallet address already registered',
            code: 'WALLET_EXISTS'
          });
        }
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const userData = {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        organization: organization || null,
        phone: phone || null,
        walletAddress: walletAddress || null,
        authMethod: 'traditional',
        verified: false, // Email verification required
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const user = await dataService.createUser(userData);

      // Generate tokens
      const accessToken = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Store refresh token
      await dataService.saveRefreshToken(user.id, refreshToken);

      // Remove password from response
      const { password: _, ...userResponse } = user;

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your email.',
        data: {
          user: {
            ...userResponse,
            permissions: ROLE_PERMISSIONS[user.role] || [],
            roleLevel: ROLE_HIERARCHY[user.role] || 1
          },
          token: accessToken,
          refreshToken,
          expiresIn: '24h'
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      });
    }
  }

  // Traditional email/password login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
          code: 'MISSING_CREDENTIALS'
        });
      }

      // Get user by email
      const user = await dataService.getUserByEmail(email.toLowerCase());
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Generate tokens
      const accessToken = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Store refresh token
      await dataService.saveRefreshToken(user.id, refreshToken);

      // Update last login
      await dataService.updateUserLastLogin(user.id);

      // Remove password from response
      const { password: _, ...userResponse } = user;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            ...userResponse,
            permissions: ROLE_PERMISSIONS[user.role] || [],
            roleLevel: ROLE_HIERARCHY[user.role] || 1
          },
          token: accessToken,
          refreshToken,
          expiresIn: '24h'
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
        code: 'LOGIN_ERROR'
      });
    }
  }

  // Web3 wallet authentication
  async walletLogin(req, res) {
    try {
      const { walletAddress, signature, message, role = 'donor' } = req.body;

      // Validate input
      if (!walletAddress || !signature || !message) {
        return res.status(400).json({
          success: false,
          error: 'Wallet address, signature, and message are required',
          code: 'MISSING_WALLET_DATA'
        });
      }

      // Validate wallet address format
      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid wallet address format',
          code: 'INVALID_WALLET_ADDRESS'
        });
      }

      // Verify signature
      try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          return res.status(401).json({
            success: false,
            error: 'Invalid signature',
            code: 'INVALID_SIGNATURE'
          });
        }
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: 'Signature verification failed',
          code: 'SIGNATURE_VERIFICATION_FAILED'
        });
      }

      // Check if user exists
      let user = await dataService.getUserByWalletAddress(walletAddress);

      if (!user) {
        // Create new user for wallet
        const userData = {
          walletAddress: walletAddress.toLowerCase(),
          role,
          authMethod: 'wallet',
          verified: true, // Wallet auth is automatically verified
          createdAt: new Date(),
          updatedAt: new Date()
        };

        user = await dataService.createUser(userData);
      } else {
        // Update last login
        await dataService.updateUserLastLogin(user.id);
      }

      // Generate tokens
      const accessToken = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Store refresh token
      await dataService.saveRefreshToken(user.id, refreshToken);

      res.json({
        success: true,
        message: 'Wallet authentication successful',
        data: {
          user: {
            ...user,
            permissions: ROLE_PERMISSIONS[user.role] || [],
            roleLevel: ROLE_HIERARCHY[user.role] || 1
          },
          token: accessToken,
          refreshToken,
          expiresIn: '24h'
        }
      });

    } catch (error) {
      console.error('Wallet auth error:', error);
      res.status(500).json({
        success: false,
        error: 'Wallet authentication failed',
        code: 'WALLET_AUTH_ERROR'
      });
    }
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required',
          code: 'MISSING_REFRESH_TOKEN'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken, 
        process.env.JWT_REFRESH_SECRET || 'development-refresh-secret'
      );

      // Check if refresh token exists in database
      const storedToken = await dataService.getRefreshToken(refreshToken);
      if (!storedToken || storedToken.userId !== decoded.id) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        });
      }

      // Get user
      const user = await dataService.getUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Generate new tokens
      const newAccessToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Update refresh token in database
      await dataService.updateRefreshToken(refreshToken, newRefreshToken);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: '24h'
        }
      });

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Refresh token expired',
          code: 'REFRESH_TOKEN_EXPIRED'
        });
      }

      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: 'Token refresh failed',
        code: 'TOKEN_REFRESH_ERROR'
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Remove refresh token from database
        await dataService.removeRefreshToken(refreshToken);
      }

      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed',
        code: 'LOGOUT_ERROR'
      });
    }
  }

  // Verify token
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided',
          code: 'NO_TOKEN'
        });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
      
      // Get user to ensure they still exist
      const user = await dataService.getUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;
      
      res.json({
        success: true,
        data: {
          user: {
            ...userResponse,
            permissions: ROLE_PERMISSIONS[user.role] || [],
            roleLevel: ROLE_HIERARCHY[user.role] || 1
          },
          decoded
        }
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = req.user;

      // Remove password from response
      const { password: _, ...userResponse } = user;

      res.json({
        success: true,
        data: {
          user: {
            ...userResponse,
            permissions: ROLE_PERMISSIONS[user.role] || [],
            roleLevel: ROLE_HIERARCHY[user.role] || 1
          }
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile',
        code: 'PROFILE_ERROR'
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const allowedUpdates = ['firstName', 'lastName', 'phone', 'organization'];
      const updates = {};

      // Filter allowed updates
      for (const field of allowedUpdates) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid fields to update',
          code: 'NO_UPDATES'
        });
      }

      updates.updatedAt = new Date();

      // Update user
      const updatedUser = await dataService.updateUser(userId, updates);

      // Remove password from response
      const { password: _, ...userResponse } = updatedUser;

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            ...userResponse,
            permissions: ROLE_PERMISSIONS[updatedUser.role] || [],
            roleLevel: ROLE_HIERARCHY[updatedUser.role] || 1
          }
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        code: 'PROFILE_UPDATE_ERROR'
      });
    }
  }
}

module.exports = new AuthController();