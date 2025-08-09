const jwt = require('jsonwebtoken');
const dataService = require('../services/dataService');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await dataService.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    await requireAuth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

const requireVendor = async (req, res, next) => {
  try {
    await requireAuth(req, res, () => {
      if (req.user.role !== 'vendor') {
        return res.status(403).json({
          success: false,
          error: 'Vendor access required'
        });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireVendor
};