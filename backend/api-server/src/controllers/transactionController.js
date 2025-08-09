const dataService = require('../services/dataService');
const blockchainService = require('../services/blockchainService');
const { validationResult } = require('express-validator');

class TransactionController {
  async getAllTransactions(req, res) {
    try {
      const { page = 1, limit = 10, vendorAddress, disasterZoneId } = req.query;
      
      const transactions = await dataService.getTransactions({
        page: parseInt(page),
        limit: parseInt(limit),
        vendorAddress,
        disasterZoneId
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

  async getTransactionByHash(req, res) {
    try {
      const { hash } = req.params;
      
      const transaction = await dataService.getTransactionByHash(hash);
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }
      
      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createTransaction(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { voucherId, amount, ipfsHash, latitude, longitude, category } = req.body;
      
      // Process on blockchain first
      const blockchainResult = await blockchainService.redeemVoucher(
        voucherId,
        amount,
        ipfsHash,
        latitude,
        longitude,
        category
      );
      
      // Save to database
      const transaction = await dataService.createTransaction({
        txHash: blockchainResult.txHash,
        voucherId,
        vendorAddress: req.user.walletAddress,
        amount,
        category,
        ipfsProofHash: ipfsHash,
        latitude,
        longitude,
        blockNumber: blockchainResult.blockNumber,
        timestamp: new Date()
      });
      
      res.status(201).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getTransactionProof(req, res) {
    try {
      const { hash } = req.params;
      
      const transaction = await dataService.getTransactionByHash(hash);
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }
      
      const proofs = await dataService.getProofsOfAid(transaction.id);
      
      res.json({
        success: true,
        data: {
          transaction,
          proofs
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

module.exports = new TransactionController();