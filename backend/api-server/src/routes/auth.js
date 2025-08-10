const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  requireAuth, 
  optionalAuth,
  requireRole,
  requirePermission 
} = require('../middleware/auth');
const validation = require('../middleware/validation');

// Public authentication routes

// Traditional registration and login
router.post('/register', 
  validation.registration || validation.walletLogin,
  authController.register
);

router.post('/login', 
  validation.login || validation.walletLogin,
  authController.login
);

// Wallet authentication
router.post('/wallet-login', 
  validation.walletLogin,
  authController.walletLogin
);

// Token management
router.post('/refresh', 
  authController.refreshToken
);

router.post('/logout', 
  authController.logout
);

router.get('/verify', 
  authController.verifyToken
);

// Protected routes (require authentication)
router.get('/profile', requireAuth, authController.getProfile);
router.put('/profile', requireAuth, authController.updateProfile);

// Admin-only routes
router.get('/users', requireRole('admin'), async (req, res) => {
  try {
    // Mock users data for now (replace with actual dataService call)
    const users = [
      { id: 1, email: 'admin@relief.network', role: 'admin', verified: true },
      { id: 2, email: 'vendor@relief.network', role: 'vendor', verified: true },
      { id: 3, email: 'victim@relief.network', role: 'victim', verified: true },
      { id: 4, email: 'donor@relief.network', role: 'donor', verified: true }
    ];
    
    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

router.put('/users/:id/role', requireRole(['admin', 'government']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Mock role update (replace with actual dataService call)
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { 
        user: { 
          id: parseInt(id), 
          role,
          updatedAt: new Date()
        } 
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    });
  }
});

// Role-based access examples
router.get('/vendor/dashboard', requireRole('vendor'), (req, res) => {
  res.json({
    success: true,
    message: 'Vendor dashboard data',
    data: {
      role: req.user.role,
      permissions: req.user.permissions,
      dashboardData: {
        activeVouchers: 5,
        pendingRedemptions: 2,
        totalSales: 1250.00
      }
    }
  });
});

router.get('/admin/analytics', requirePermission(['analytics:full', 'analytics:view']), (req, res) => {
  res.json({
    success: true,
    message: 'Analytics data',
    data: {
      role: req.user.role,
      permissions: req.user.permissions,
      analytics: {
        totalUsers: 156,
        totalDonations: 45000.00,
        activeDisasters: 3,
        vouchersIssued: 89
      }
    }
  });
});

// Multi-role endpoints
router.get('/dashboard', requireRole(['admin', 'vendor', 'victim', 'donor']), (req, res) => {
  const dashboardData = {
    admin: {
      totalUsers: 156,
      totalDonations: 45000.00,
      activeDisasters: 3,
      systemHealth: 'healthy'
    },
    vendor: {
      activeVouchers: 5,
      pendingRedemptions: 2,
      totalSales: 1250.00
    },
    victim: {
      availableVouchers: 3,
      voucherBalance: 150.00,
      claimedAid: 75.00
    },
    donor: {
      totalDonated: 500.00,
      impactMetrics: {
        peopleFed: 12,
        familiesHelped: 4
      }
    }
  };

  res.json({
    success: true,
    message: `${req.user.role} dashboard data`,
    data: {
      role: req.user.role,
      permissions: req.user.permissions,
      dashboard: dashboardData[req.user.role] || {}
    }
  });
});

// Development/testing endpoints
if (process.env.NODE_ENV === 'development') {
  router.get('/test-roles', optionalAuth, (req, res) => {
    res.json({
      success: true,
      data: {
        user: req.user || null,
        authenticated: !!req.user,
        message: 'Role testing endpoint',
        availableRoles: ['admin', 'government', 'treasury', 'oracle', 'vendor', 'victim', 'donor']
      }
    });
  });

  // Demo login endpoints for quick testing
  router.post('/demo-login/:role', (req, res) => {
    const { role } = req.params;
    const validRoles = ['admin', 'government', 'treasury', 'oracle', 'vendor', 'victim', 'donor'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid demo role'
      });
    }

    const demoUser = {
      id: Math.floor(Math.random() * 1000),
      email: `${role}@relief.network`,
      role,
      verified: true,
      authMethod: 'demo'
    };

    const token = authController.generateToken(demoUser);

    res.json({
      success: true,
      message: `Demo ${role} login successful`,
      data: {
        user: demoUser,
        token,
        expiresIn: '24h'
      }
    });
  });
}

module.exports = router;