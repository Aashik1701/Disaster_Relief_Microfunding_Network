const jwt = require('jsonwebtoken');
const dataService = require('../services/dataService');

// Role hierarchy for permission checking
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

// Permission mappings for each role
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

// Basic authentication middleware
const requireAuth = async (req, res, next) => {
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
    
    // Get user from database
    const user = await dataService.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Add permissions to user object
    user.permissions = ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS.guest;
    user.roleLevel = ROLE_HIERARCHY[user.role] || ROLE_HIERARCHY.guest;
    
    req.user = user;
    next();
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
};

// Role-based middleware creator
const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      await requireAuth(req, res, () => {
        const userRole = req.user.role;
        
        // Convert single role to array
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        
        if (!roles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            error: `Access denied. Required roles: ${roles.join(', ')}`,
            code: 'INSUFFICIENT_ROLE',
            userRole,
            requiredRoles: roles
          });
        }
        
        next();
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
    }
  };
};

// Permission-based middleware creator
const requirePermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      await requireAuth(req, res, () => {
        const userPermissions = req.user.permissions || [];
        
        // Convert single permission to array
        const permissions = Array.isArray(requiredPermissions) 
          ? requiredPermissions 
          : [requiredPermissions];
        
        // Check if user has any of the required permissions or manage:all
        const hasPermission = permissions.some(permission => 
          userPermissions.includes(permission) || userPermissions.includes('manage:all')
        );
        
        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            error: `Access denied. Required permissions: ${permissions.join(', ')}`,
            code: 'INSUFFICIENT_PERMISSION',
            userPermissions,
            requiredPermissions: permissions
          });
        }
        
        next();
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
    }
  };
};

// Minimum role level middleware
const requireMinimumRole = (minimumRole) => {
  return async (req, res, next) => {
    try {
      await requireAuth(req, res, () => {
        const userLevel = req.user.roleLevel;
        const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
        
        if (userLevel < requiredLevel) {
          return res.status(403).json({
            success: false,
            error: `Access denied. Minimum role required: ${minimumRole}`,
            code: 'INSUFFICIENT_ROLE_LEVEL',
            userRole: req.user.role,
            minimumRole
          });
        }
        
        next();
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
    }
  };
};

// Specific role middleware functions (for backward compatibility)
const requireAdmin = requireRole('admin');
const requireVendor = requireRole('vendor');
const requireVictim = requireRole('victim');
const requireDonor = requireRole('donor');

// Government roles middleware
const requireGovernment = requireRole('government');
const requireTreasury = requireRole('treasury');
const requireOracle = requireRole('oracle');

// Multiple roles middleware
const requireAdminOrGovernment = requireRole(['admin', 'government']);
const requireAdminOrTreasury = requireRole(['admin', 'treasury']);
const requireVendorOrAdmin = requireRole(['vendor', 'admin']);

// Permission-specific middleware
const requireDisasterManagement = requirePermission(['disaster:create', 'disaster:update', 'manage:all']);
const requireVendorManagement = requirePermission(['vendor:approve', 'vendor:reject', 'manage:all']);
const requireUserManagement = requirePermission(['user:manage', 'manage:all']);
const requireAnalyticsAccess = requirePermission(['analytics:view', 'analytics:full', 'manage:all']);

// Optional authentication (for public endpoints that benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
      const user = await dataService.getUserById(decoded.id);
      
      if (user) {
        user.permissions = ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS.guest;
        user.roleLevel = ROLE_HIERARCHY[user.role] || ROLE_HIERARCHY.guest;
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Role validation helper
const validateUserRole = (user, allowedRoles) => {
  if (!user || !user.role) return false;
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};

// Permission validation helper
const validateUserPermission = (user, requiredPermissions) => {
  if (!user || !user.permissions) return false;
  
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];
  
  return permissions.some(permission => 
    user.permissions.includes(permission) || user.permissions.includes('manage:all')
  );
};

// User context middleware (adds role info to response)
const addUserContext = (req, res, next) => {
  res.locals.userRole = req.user?.role;
  res.locals.userPermissions = req.user?.permissions;
  res.locals.isAuthenticated = !!req.user;
  next();
};

module.exports = {
  // Basic auth
  requireAuth,
  optionalAuth,
  
  // Role-based auth
  requireRole,
  requireMinimumRole,
  requireAdmin,
  requireVendor,
  requireVictim,
  requireDonor,
  requireGovernment,
  requireTreasury,
  requireOracle,
  
  // Multi-role auth
  requireAdminOrGovernment,
  requireAdminOrTreasury,
  requireVendorOrAdmin,
  
  // Permission-based auth
  requirePermission,
  requireDisasterManagement,
  requireVendorManagement,
  requireUserManagement,
  requireAnalyticsAccess,
  
  // Helpers
  validateUserRole,
  validateUserPermission,
  addUserContext,
  
  // Constants
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS
};