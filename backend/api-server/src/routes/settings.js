const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const { requireAuth, requireRole } = require('../middleware/auth');

// All settings routes require authentication
router.use(requireAuth);

// Get all system settings (admin only)
router.get('/', requireRole(['admin']), async (req, res) => {
  try {
    const { category } = req.query;
    const settings = await dataService.getSystemSettings(category);
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system settings',
      error: error.message
    });
  }
});

// Get specific setting
router.get('/:key', requireRole(['admin', 'treasury']), async (req, res) => {
  try {
    const { key } = req.params;
    const { defaultValue } = req.query;
    
    const value = await dataService.getSystemSetting(key, defaultValue);
    
    if (value === null) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }
    
    res.json({
      success: true,
      data: { key, value }
    });
  } catch (error) {
    console.error('Error fetching system setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system setting',
      error: error.message
    });
  }
});

// Update or create setting (admin only)
router.put('/:key', requireRole(['admin']), async (req, res) => {
  try {
    const { key } = req.params;
    const { value, type = 'string', description, category = 'general' } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Value is required'
      });
    }
    
    const setting = await dataService.setSystemSetting(
      key, 
      value, 
      type, 
      description, 
      category, 
      req.user.id
    );
    
    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting
    });
  } catch (error) {
    console.error('Error updating system setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update system setting',
      error: error.message
    });
  }
});

// Get settings by category
router.get('/category/:category', requireRole(['admin', 'treasury']), async (req, res) => {
  try {
    const { category } = req.params;
    const settings = await dataService.getSystemSettings(category);
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings by category',
      error: error.message
    });
  }
});

module.exports = router;
