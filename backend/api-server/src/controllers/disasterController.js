const dataService = require('../services/dataService');
const blockchainService = require('../services/blockchainService');
const { validationResult } = require('express-validator');

class DisasterController {
  async getAllDisasters(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      
      const disasters = await dataService.getDisasters({
        page: parseInt(page),
        limit: parseInt(limit),
        status
      });
      
      res.json({
        success: true,
        data: disasters,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: disasters.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getDisasterById(req, res) {
    try {
      const { id } = req.params;
      
      const disaster = await dataService.getDisasterById(parseInt(id));
      
      if (!disaster) {
        return res.status(404).json({
          success: false,
          error: 'Disaster not found'
        });
      }
      
      res.json({
        success: true,
        data: disaster
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createDisaster(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { name, latitude, longitude, radius, initialFunding } = req.body;
      
      // Create on blockchain first
      const blockchainResult = await blockchainService.createDisasterZone(
        name,
        latitude,
        longitude,
        radius,
        initialFunding
      );
      
      // Save to database
      const disaster = await dataService.createDisaster({
        zoneId: blockchainResult.zoneId,
        name,
        latitude,
        longitude,
        radius,
        initialFunding,
        txHash: blockchainResult.txHash,
        createdBy: req.user.id
      });
      
      res.status(201).json({
        success: true,
        data: disaster
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateDisasterStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const disaster = await dataService.updateDisaster(parseInt(id), { status });
      
      res.json({
        success: true,
        data: disaster
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getDisasterStats(req, res) {
    try {
      const { id } = req.params;
      
      const stats = await dataService.getDisasterStats(parseInt(id));
      
      if (!stats) {
        return res.status(404).json({
          success: false,
          error: 'Disaster not found'
        });
      }
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getDisasterTransactions(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const transactions = await dataService.getTransactions({
        page: parseInt(page),
        limit: parseInt(limit),
        disasterZoneId: parseInt(id)
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

module.exports = new DisasterController();