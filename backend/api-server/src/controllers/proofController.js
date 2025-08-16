const dataService = require('../services/dataService');
const { validationResult } = require('express-validator');

class ProofController {
  // Submit proof of aid
  async submitProof(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const {
        transactionId,
        voucherId,
        category,
        description,
        items,
        location,
        metadata
      } = req.body;

      // Validate transaction exists and belongs to this vendor
      const transaction = await dataService.getTransactionByHash(transactionId);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      if (transaction.vendorAddress !== req.user.walletAddress) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized for this transaction'
        });
      }

      // Create proof record
      const proofData = {
        transactionId: transaction.id,
        voucherId: voucherId || transaction.voucherId,
        vendorAddress: req.user.walletAddress,
        category,
        description,
        items: JSON.stringify(items || []),
        location: JSON.stringify(location || {}),
        metadata: JSON.stringify(metadata || {}),
        submittedAt: new Date(),
        verificationStatus: 'pending'
      };

      // If files were uploaded, add their IPFS hashes
      if (req.files && req.files.length > 0) {
        const fileHashes = req.files.map(file => file.ipfsHash);
        proofData.attachments = JSON.stringify(fileHashes);
      }

      const proof = await dataService.createProofOfAid(proofData);

      // Log the action
      await dataService.logAction({
        userId: req.user.id,
        walletAddress: req.user.walletAddress,
        action: 'SUBMIT_PROOF',
        resource: 'proof_of_aid',
        resourceId: proof.id,
        newValues: proof,
        metadata: {
          transactionId,
          voucherId,
          category
        }
      });

      res.status(201).json({
        success: true,
        data: proof,
        message: 'Proof of aid submitted successfully'
      });
    } catch (error) {
      console.error('Submit proof error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get all proofs with filtering
  async getAllProofs(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        vendorAddress,
        category,
        verificationStatus,
        startDate,
        endDate
      } = req.query;

      // Build filter options
      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      if (vendorAddress) options.vendorAddress = vendorAddress;
      if (category) options.category = category;
      if (verificationStatus) options.verificationStatus = verificationStatus;
      
      if (startDate || endDate) {
        options.dateRange = {
          start: startDate ? new Date(startDate) : undefined,
          end: endDate ? new Date(endDate) : undefined
        };
      }

      const proofs = await this.getFilteredProofs(options);

      res.json({
        success: true,
        data: proofs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: proofs.length
        }
      });
    } catch (error) {
      console.error('Get proofs error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get proof by ID
  async getProofById(req, res) {
    try {
      const { id } = req.params;
      
      const proof = await this.getProofWithDetails(parseInt(id));
      if (!proof) {
        return res.status(404).json({
          success: false,
          error: 'Proof not found'
        });
      }

      res.json({
        success: true,
        data: proof
      });
    } catch (error) {
      console.error('Get proof error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get proofs for a specific transaction
  async getTransactionProofs(req, res) {
    try {
      const { transactionId } = req.params;
      
      const transaction = await dataService.getTransactionByHash(transactionId);
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
          transaction: {
            id: transaction.id,
            txHash: transaction.txHash,
            amount: transaction.amount,
            category: transaction.category,
            timestamp: transaction.timestamp
          },
          proofs: proofs.map(proof => ({
            ...proof.toJSON(),
            items: JSON.parse(proof.items || '[]'),
            location: JSON.parse(proof.location || '{}'),
            metadata: JSON.parse(proof.metadata || '{}'),
            attachments: JSON.parse(proof.attachments || '[]')
          }))
        }
      });
    } catch (error) {
      console.error('Get transaction proofs error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get proofs for a specific voucher
  async getVoucherProofs(req, res) {
    try {
      const { voucherId } = req.params;
      
      const voucher = await dataService.getVoucherById(parseInt(voucherId));
      if (!voucher) {
        return res.status(404).json({
          success: false,
          error: 'Voucher not found'
        });
      }

      // Get all transactions for this voucher
      const transactions = await dataService.getTransactions({ voucherId: voucher.voucherId });
      
      // Get proofs for all transactions
      const allProofs = [];
      for (const transaction of transactions) {
        const proofs = await dataService.getProofsOfAid(transaction.id);
        allProofs.push(...proofs);
      }

      res.json({
        success: true,
        data: {
          voucher: {
            id: voucher.id,
            voucherId: voucher.voucherId,
            amount: voucher.amount,
            beneficiary: voucher.beneficiary,
            used: voucher.used
          },
          proofs: allProofs.map(proof => ({
            ...proof.toJSON(),
            items: JSON.parse(proof.items || '[]'),
            location: JSON.parse(proof.location || '{}'),
            metadata: JSON.parse(proof.metadata || '{}'),
            attachments: JSON.parse(proof.attachments || '[]')
          })),
          totalTransactions: transactions.length
        }
      });
    } catch (error) {
      console.error('Get voucher proofs error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Verify proof (admin/oracle only)
  async verifyProof(req, res) {
    try {
      const { id } = req.params;
      const { verified, verificationNotes, verifierComments } = req.body;

      const proof = await this.getProofWithDetails(parseInt(id));
      if (!proof) {
        return res.status(404).json({
          success: false,
          error: 'Proof not found'
        });
      }

      // Update verification status
      const updatedProof = await proof.update({
        verificationStatus: verified ? 'verified' : 'rejected',
        verificationNotes,
        verifiedBy: req.user.id,
        verifiedAt: new Date(),
        verifierComments
      });

      // Log the action
      await dataService.logAction({
        userId: req.user.id,
        walletAddress: req.user.walletAddress,
        action: verified ? 'VERIFY_PROOF' : 'REJECT_PROOF',
        resource: 'proof_of_aid',
        resourceId: proof.id,
        oldValues: { verificationStatus: proof.verificationStatus },
        newValues: { 
          verificationStatus: updatedProof.verificationStatus,
          verifiedBy: req.user.id,
          verificationNotes
        },
        metadata: {
          verifierComments,
          transactionId: proof.transactionId
        }
      });

      res.json({
        success: true,
        data: {
          ...updatedProof.toJSON(),
          items: JSON.parse(updatedProof.items || '[]'),
          location: JSON.parse(updatedProof.location || '{}'),
          metadata: JSON.parse(updatedProof.metadata || '{}'),
          attachments: JSON.parse(updatedProof.attachments || '[]')
        },
        message: `Proof ${verified ? 'verified' : 'rejected'} successfully`
      });
    } catch (error) {
      console.error('Verify proof error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get proof statistics
  async getProofStats(req, res) {
    try {
      const { 
        period = 'all',
        vendorAddress,
        category,
        zoneId 
      } = req.query;

      const stats = await this.calculateProofStats({
        period,
        vendorAddress,
        category,
        zoneId: zoneId ? parseInt(zoneId) : undefined
      });

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Proof stats error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get vendor's proof submissions
  async getVendorProofs(req, res) {
    try {
      const { address } = req.params;
      const { 
        page = 1, 
        limit = 10, 
        category, 
        verificationStatus 
      } = req.query;

      // Verify vendor exists
      const vendor = await dataService.getVendorByAddress(address);
      if (!vendor) {
        return res.status(404).json({
          success: false,
          error: 'Vendor not found'
        });
      }

      const proofs = await this.getFilteredProofs({
        vendorAddress: address,
        category,
        verificationStatus,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      // Calculate vendor proof statistics
      const vendorStats = {
        total: proofs.length,
        verified: proofs.filter(p => p.verificationStatus === 'verified').length,
        pending: proofs.filter(p => p.verificationStatus === 'pending').length,
        rejected: proofs.filter(p => p.verificationStatus === 'rejected').length
      };

      res.json({
        success: true,
        data: {
          vendor: {
            address: vendor.walletAddress,
            name: vendor.name,
            status: vendor.status
          },
          proofs,
          stats: vendorStats,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: proofs.length
          }
        }
      });
    } catch (error) {
      console.error('Get vendor proofs error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Helper methods
  async getFilteredProofs(options) {
    // This would need to be implemented in dataService for better performance
    // For now, using a simplified approach
    const allProofs = await this.getAllProofsFromDatabase(options);
    return allProofs;
  }

  async getAllProofsFromDatabase(options = {}) {
    // Simplified implementation - would need proper SQL queries for production
    try {
      const { ProofOfAid } = require('../models');
      
      const whereClause = {};
      if (options.vendorAddress) whereClause.vendorAddress = options.vendorAddress;
      if (options.category) whereClause.category = options.category;
      if (options.verificationStatus) whereClause.verificationStatus = options.verificationStatus;

      const proofs = await ProofOfAid.findAll({
        where: whereClause,
        limit: options.limit || 100,
        offset: options.page ? (options.page - 1) * (options.limit || 10) : 0,
        order: [['submittedAt', 'DESC']]
      });

      return proofs.map(proof => ({
        ...proof.toJSON(),
        items: JSON.parse(proof.items || '[]'),
        location: JSON.parse(proof.location || '{}'),
        metadata: JSON.parse(proof.metadata || '{}'),
        attachments: JSON.parse(proof.attachments || '[]')
      }));
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  }

  async getProofWithDetails(proofId) {
    try {
      const { ProofOfAid, Transaction, Vendor, Voucher } = require('../models');
      
      const proof = await ProofOfAid.findByPk(proofId, {
        include: [
          {
            model: Transaction,
            as: 'transaction',
            include: [
              { model: Vendor, as: 'vendor' },
              { model: Voucher, as: 'voucher' }
            ]
          }
        ]
      });

      if (proof) {
        return {
          ...proof.toJSON(),
          items: JSON.parse(proof.items || '[]'),
          location: JSON.parse(proof.location || '{}'),
          metadata: JSON.parse(proof.metadata || '{}'),
          attachments: JSON.parse(proof.attachments || '[]')
        };
      }

      return null;
    } catch (error) {
      console.error('Get proof details error:', error);
      return null;
    }
  }

  async calculateProofStats(options = {}) {
    try {
      const allProofs = await this.getAllProofsFromDatabase();
      
      let filteredProofs = allProofs;
      
      if (options.vendorAddress) {
        filteredProofs = filteredProofs.filter(p => p.vendorAddress === options.vendorAddress);
      }
      
      if (options.category) {
        filteredProofs = filteredProofs.filter(p => p.category === options.category);
      }

      const stats = {
        total: filteredProofs.length,
        verified: filteredProofs.filter(p => p.verificationStatus === 'verified').length,
        pending: filteredProofs.filter(p => p.verificationStatus === 'pending').length,
        rejected: filteredProofs.filter(p => p.verificationStatus === 'rejected').length,
        categories: {},
        verificationRate: 0
      };

      // Calculate verification rate
      if (stats.total > 0) {
        stats.verificationRate = ((stats.verified / stats.total) * 100).toFixed(1);
      }

      // Calculate category breakdown
      filteredProofs.forEach(proof => {
        const category = proof.category || 'uncategorized';
        if (!stats.categories[category]) {
          stats.categories[category] = 0;
        }
        stats.categories[category]++;
      });

      return stats;
    } catch (error) {
      console.error('Calculate proof stats error:', error);
      return {
        total: 0,
        verified: 0,
        pending: 0,
        rejected: 0,
        categories: {},
        verificationRate: 0
      };
    }
  }
}

module.exports = new ProofController();
