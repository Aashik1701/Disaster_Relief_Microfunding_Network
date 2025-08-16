const dataService = require('../services/dataService');
const blockchainService = require('../services/blockchainService');
const { validationResult } = require('express-validator');

class VoucherController {
  // Get all vouchers with filtering
  async getAllVouchers(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        beneficiary, 
        disasterZoneId, 
        status, 
        category 
      } = req.query;

      // Build filter options
      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      let vouchers;
      if (beneficiary) {
        vouchers = await dataService.getVouchers(beneficiary);
      } else {
        // Would need to implement filtered getVouchers in dataService
        vouchers = await this.getFilteredVouchers({
          disasterZoneId: disasterZoneId ? parseInt(disasterZoneId) : undefined,
          status,
          category,
          ...options
        });
      }

      res.json({
        success: true,
        data: vouchers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: vouchers.length
        }
      });
    } catch (error) {
      console.error('Get vouchers error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get voucher by ID
  async getVoucherById(req, res) {
    try {
      const { id } = req.params;
      
      const voucher = await dataService.getVoucherById(parseInt(id));
      
      if (!voucher) {
        return res.status(404).json({
          success: false,
          error: 'Voucher not found'
        });
      }

      res.json({
        success: true,
        data: voucher
      });
    } catch (error) {
      console.error('Get voucher error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Issue new voucher (admin/government only)
  async issueVoucher(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const {
        beneficiary,
        disasterZoneId,
        amount,
        allowedCategories,
        expiryTime,
        recipientId
      } = req.body;

      // Create voucher on blockchain first
      const blockchainResult = await blockchainService.issueVoucher(
        beneficiary,
        amount,
        disasterZoneId,
        allowedCategories,
        expiryTime
      );

      // Save to database
      const voucher = await dataService.createVoucher({
        voucherId: blockchainResult.voucherId,
        beneficiary,
        recipientId,
        disasterZoneId,
        amount,
        expiryTime: new Date(expiryTime),
        allowedCategories: JSON.stringify(allowedCategories),
        txHash: blockchainResult.txHash,
        used: false
      });

      // Log the action
      await dataService.logAction({
        userId: req.user.id,
        walletAddress: req.user.walletAddress,
        action: 'ISSUE_VOUCHER',
        resource: 'voucher',
        resourceId: voucher.id,
        newValues: voucher,
        metadata: {
          beneficiary,
          amount,
          disasterZoneId,
          txHash: blockchainResult.txHash
        }
      });

      res.status(201).json({
        success: true,
        data: voucher,
        blockchain: {
          txHash: blockchainResult.txHash,
          voucherId: blockchainResult.voucherId
        }
      });
    } catch (error) {
      console.error('Issue voucher error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Redeem voucher (vendor only)
  async redeemVoucher(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const {
        amount,
        category,
        ipfsProofHash,
        latitude,
        longitude,
        description
      } = req.body;

      // Get voucher first
      const voucher = await dataService.getVoucherById(parseInt(id));
      if (!voucher) {
        return res.status(404).json({
          success: false,
          error: 'Voucher not found'
        });
      }

      // Validate voucher
      if (voucher.used) {
        return res.status(400).json({
          success: false,
          error: 'Voucher already used'
        });
      }

      if (new Date() > new Date(voucher.expiryTime)) {
        return res.status(400).json({
          success: false,
          error: 'Voucher has expired'
        });
      }

      if (parseFloat(amount) > parseFloat(voucher.amount)) {
        return res.status(400).json({
          success: false,
          error: 'Redemption amount exceeds voucher value'
        });
      }

      // Process redemption on blockchain
      const blockchainResult = await blockchainService.redeemVoucher(
        voucher.voucherId,
        amount,
        ipfsProofHash,
        latitude,
        longitude,
        category
      );

      // Create transaction record
      const transaction = await dataService.createTransaction({
        txHash: blockchainResult.txHash,
        voucherId: voucher.voucherId,
        vendorAddress: req.user.walletAddress,
        amount: parseFloat(amount),
        category,
        ipfsProofHash,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        blockNumber: blockchainResult.blockNumber,
        timestamp: new Date(),
        description
      });

      // Mark voucher as used if fully redeemed
      if (parseFloat(amount) >= parseFloat(voucher.amount)) {
        await voucher.update({ used: true });
      }

      // Log the action
      await dataService.logAction({
        userId: req.user.id,
        walletAddress: req.user.walletAddress,
        action: 'REDEEM_VOUCHER',
        resource: 'voucher',
        resourceId: voucher.id,
        newValues: { used: voucher.used, lastRedemption: amount },
        metadata: {
          transactionId: transaction.id,
          amount,
          category,
          txHash: blockchainResult.txHash
        }
      });

      res.json({
        success: true,
        data: {
          transaction,
          voucher: {
            id: voucher.id,
            voucherId: voucher.voucherId,
            remainingAmount: parseFloat(voucher.amount) - parseFloat(amount),
            used: voucher.used
          }
        },
        blockchain: {
          txHash: blockchainResult.txHash,
          blockNumber: blockchainResult.blockNumber
        }
      });
    } catch (error) {
      console.error('Redeem voucher error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get user's vouchers
  async getUserVouchers(req, res) {
    try {
      const { address } = req.params;
      const { status = 'all' } = req.query;

      const vouchers = await dataService.getVouchers(address);
      
      let filteredVouchers = vouchers;
      if (status !== 'all') {
        switch (status) {
          case 'active':
            filteredVouchers = vouchers.filter(v => 
              !v.used && new Date(v.expiryTime) > new Date()
            );
            break;
          case 'used':
            filteredVouchers = vouchers.filter(v => v.used);
            break;
          case 'expired':
            filteredVouchers = vouchers.filter(v => 
              !v.used && new Date(v.expiryTime) <= new Date()
            );
            break;
        }
      }

      // Calculate summary
      const summary = {
        total: vouchers.length,
        active: vouchers.filter(v => !v.used && new Date(v.expiryTime) > new Date()).length,
        used: vouchers.filter(v => v.used).length,
        expired: vouchers.filter(v => !v.used && new Date(v.expiryTime) <= new Date()).length,
        totalValue: vouchers.reduce((sum, v) => sum + parseFloat(v.amount || 0), 0),
        activeValue: vouchers
          .filter(v => !v.used && new Date(v.expiryTime) > new Date())
          .reduce((sum, v) => sum + parseFloat(v.amount || 0), 0)
      };

      res.json({
        success: true,
        data: {
          vouchers: filteredVouchers,
          summary
        }
      });
    } catch (error) {
      console.error('Get user vouchers error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get voucher statistics for a disaster zone
  async getZoneVoucherStats(req, res) {
    try {
      const { zoneId } = req.params;
      
      const disaster = await dataService.getDisasterById(parseInt(zoneId));
      if (!disaster) {
        return res.status(404).json({
          success: false,
          error: 'Disaster zone not found'
        });
      }

      // Get vouchers for this zone (would need to implement in dataService)
      const vouchers = disaster.vouchers || [];
      
      const stats = {
        total: vouchers.length,
        issued: vouchers.length,
        redeemed: vouchers.filter(v => v.used).length,
        expired: vouchers.filter(v => 
          !v.used && new Date(v.expiryTime) <= new Date()
        ).length,
        active: vouchers.filter(v => 
          !v.used && new Date(v.expiryTime) > new Date()
        ).length,
        totalValue: vouchers.reduce((sum, v) => sum + parseFloat(v.amount || 0), 0),
        redeemedValue: vouchers
          .filter(v => v.used)
          .reduce((sum, v) => sum + parseFloat(v.amount || 0), 0),
        utilizationRate: 0
      };

      if (stats.totalValue > 0) {
        stats.utilizationRate = ((stats.redeemedValue / stats.totalValue) * 100).toFixed(1);
      }

      res.json({
        success: true,
        data: {
          zoneId: disaster.zoneId,
          zoneName: disaster.name,
          stats
        }
      });
    } catch (error) {
      console.error('Zone voucher stats error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Validate voucher (for vendor verification)
  async validateVoucher(req, res) {
    try {
      const { id } = req.params;
      
      const voucher = await dataService.getVoucherById(parseInt(id));
      if (!voucher) {
        return res.status(404).json({
          success: false,
          error: 'Voucher not found'
        });
      }

      const validation = {
        valid: false,
        voucher: {
          id: voucher.id,
          voucherId: voucher.voucherId,
          amount: voucher.amount,
          beneficiary: voucher.beneficiary,
          allowedCategories: JSON.parse(voucher.allowedCategories || '[]'),
          expiryTime: voucher.expiryTime,
          used: voucher.used
        },
        issues: []
      };

      // Check if voucher is already used
      if (voucher.used) {
        validation.issues.push('Voucher has already been used');
      }

      // Check if voucher is expired
      if (new Date() > new Date(voucher.expiryTime)) {
        validation.issues.push('Voucher has expired');
      }

      // Check if vendor is authorized for this disaster zone
      const vendor = await dataService.getVendorByAddress(req.user.walletAddress);
      if (!vendor || vendor.disasterZoneId !== voucher.disasterZoneId) {
        validation.issues.push('Vendor not authorized for this disaster zone');
      }

      validation.valid = validation.issues.length === 0;

      res.json({
        success: true,
        data: validation
      });
    } catch (error) {
      console.error('Validate voucher error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Helper method for filtered voucher retrieval
  async getFilteredVouchers(options) {
    // This would need to be implemented in dataService
    // For now, return all vouchers and filter in memory (not ideal for production)
    const allVouchers = await dataService.getVouchers();
    
    let filtered = allVouchers;
    
    if (options.disasterZoneId) {
      filtered = filtered.filter(v => v.disasterZoneId === options.disasterZoneId);
    }
    
    if (options.status) {
      switch (options.status) {
        case 'active':
          filtered = filtered.filter(v => !v.used && new Date(v.expiryTime) > new Date());
          break;
        case 'used':
          filtered = filtered.filter(v => v.used);
          break;
        case 'expired':
          filtered = filtered.filter(v => !v.used && new Date(v.expiryTime) <= new Date());
          break;
      }
    }

    // Apply pagination
    const start = (options.page - 1) * options.limit;
    const end = start + options.limit;
    
    return filtered.slice(start, end);
  }
}

module.exports = new VoucherController();
