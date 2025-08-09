const dataService = require('../services/dataService');
const { validationResult } = require('express-validator');

class VendorController {
  async getAllVendors(req, res) {
    try {
      const { disasterZoneId } = req.query;
      
      const vendors = await dataService.getVendors(disasterZoneId);
      
      res.json({
        success: true,
        data: vendors
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getVendorByAddress(req, res) {
    try {
      const { address } = req.params;
      
      const vendor = await dataService.getVendorByAddress(address);
      
      if (!vendor) {
        return res.status(404).json({
          success: false,
          error: 'Vendor not found'
        });
      }
      
      res.json({
        success: true,
        data: vendor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async registerVendor(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { walletAddress, name, location, disasterZoneId, kycIpfsHash } = req.body;
      
      const vendor = await dataService.createVendor({
        walletAddress,
        name,
        location,
        disasterZoneId,
        kycIpfsHash,
        verified: true
      });
      
      res.status(201).json({
        success: true,
        data: vendor
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateVendorStatus(req, res) {
    try {
      const { address } = req.params;
      const { verified, reputationScore } = req.body;
      
      const vendor = await dataService.getVendorByAddress(address);
      
      if (!vendor) {
        return res.status(404).json({
          success: false,
          error: 'Vendor not found'
        });
      }
      
      // Update vendor
      await vendor.update({ verified, reputationScore });
      
      // Clear cache
      const cache = require('../services/cacheService');
      await cache.delete(`vendor:${address}`);
      
      res.json({
        success: true,
        data: vendor
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getVendorTransactions(req, res) {
    try {
      const { address } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const transactions = await dataService.getTransactions({
        page: parseInt(page),
        limit: parseInt(limit),
        vendorAddress: address
      });
      
      res.json({
        success: true,
        data: transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: transactions.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new VendorController();