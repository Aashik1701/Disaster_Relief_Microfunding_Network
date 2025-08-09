const { 
  sequelize, 
  Disaster, 
  Vendor, 
  Voucher, 
  Transaction, 
  ProofOfAid,
  AnalyticsCache 
} = require('../models');
const cache = require('./cacheService');

class DataService {
  // Disaster operations with caching
  async getDisasters(options = {}) {
    const { page = 1, limit = 10, status } = options;
    const cacheKey = `disasters:${page}:${limit}:${status}`;
    
    // Try cache first
    let disasters = await cache.get(cacheKey);
    
    if (!disasters) {
      disasters = await Disaster.findAll({
        where: status ? { status } : {},
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
        include: [
          { model: Vendor, as: 'vendors' },
          { model: Voucher, as: 'vouchers' }
        ]
      });
      
      // Cache for 5 minutes
      await cache.set(cacheKey, disasters, 300);
    }
    
    return disasters;
  }

  async getDisasterById(zoneId) {
    const cacheKey = `disaster:${zoneId}`;
    
    // Try cache first
    let disaster = await cache.get(cacheKey);
    
    if (!disaster) {
      disaster = await Disaster.findOne({
        where: { zoneId },
        include: [
          { model: Vendor, as: 'vendors' },
          { model: Voucher, as: 'vouchers' }
        ]
      });
      
      // Cache for 10 minutes
      if (disaster) {
        await cache.set(cacheKey, disaster, 600);
      }
    }
    
    return disaster;
  }

  async createDisaster(disasterData) {
    const disaster = await Disaster.create(disasterData);
    
    // Clear cache
    await cache.deletePattern('disasters:*');
    await cache.delete(`disaster:${disaster.zoneId}`);
    
    return disaster;
  }

  async updateDisaster(zoneId, updates) {
    await Disaster.update(updates, { where: { zoneId } });
    
    // Clear cache
    await cache.deletePattern('disasters:*');
    await cache.delete(`disaster:${zoneId}`);
    
    return this.getDisasterById(zoneId);
  }

  // Vendor operations with caching
  async getVendors(disasterZoneId) {
    const cacheKey = `vendors:${disasterZoneId}`;
    
    // Try cache first
    let vendors = await cache.get(cacheKey);
    
    if (!vendors) {
      vendors = await Vendor.findAll({
        where: { disasterZoneId },
        order: [['createdAt', 'DESC']]
      });
      
      // Cache for 10 minutes
      await cache.set(cacheKey, vendors, 600);
    }
    
    return vendors;
  }

  async getVendorByAddress(walletAddress) {
    const cacheKey = `vendor:${walletAddress}`;
    
    // Try cache first
    let vendor = await cache.get(cacheKey);
    
    if (!vendor) {
      vendor = await Vendor.findOne({
        where: { walletAddress },
        include: [
          { model: Disaster, as: 'disaster' },
          { model: Transaction, as: 'transactions' }
        ]
      });
      
      // Cache for 10 minutes
      if (vendor) {
        await cache.set(cacheKey, vendor, 600);
      }
    }
    
    return vendor;
  }

  async createVendor(vendorData) {
    const vendor = await Vendor.create(vendorData);
    
    // Clear cache
    await cache.deletePattern('vendors:*');
    await cache.delete(`vendor:${vendor.walletAddress}`);
    
    return vendor;
  }

  // Voucher operations with caching
  async getVouchers(beneficiary) {
    const cacheKey = `vouchers:${beneficiary}`;
    
    // Try cache first
    let vouchers = await cache.get(cacheKey);
    
    if (!vouchers) {
      vouchers = await Voucher.findAll({
        where: { beneficiary },
        order: [['createdAt', 'DESC']]
      });
      
      // Cache for 5 minutes
      await cache.set(cacheKey, vouchers, 300);
    }
    
    return vouchers;
  }

  async getVoucherById(voucherId) {
    const cacheKey = `voucher:${voucherId}`;
    
    // Try cache first
    let voucher = await cache.get(cacheKey);
    
    if (!voucher) {
      voucher = await Voucher.findOne({
        where: { voucherId },
        include: [
          { model: Disaster, as: 'disaster' },
          { model: Transaction, as: 'transactions' }
        ]
      });
      
      // Cache for 10 minutes
      if (voucher) {
        await cache.set(cacheKey, voucher, 600);
      }
    }
    
    return voucher;
  }

  async createVoucher(voucherData) {
    const voucher = await Voucher.create(voucherData);
    
    // Clear cache
    await cache.deletePattern('vouchers:*');
    await cache.delete(`voucher:${voucher.voucherId}`);
    await cache.delete(`disaster:${voucher.disasterZoneId}`);
    
    return voucher;
  }

  // Transaction operations with caching
  async getTransactions(options = {}) {
    const { page = 1, limit = 10, vendorAddress, disasterZoneId } = options;
    const cacheKey = `transactions:${page}:${limit}:${vendorAddress || 'all'}:${disasterZoneId || 'all'}`;
    
    // Try cache first
    let transactions = await cache.get(cacheKey);
    
    if (!transactions) {
      const whereClause = {};
      if (vendorAddress) whereClause.vendorAddress = vendorAddress;
      
      transactions = await Transaction.findAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [['timestamp', 'DESC']],
        include: [
          { model: Vendor, as: 'vendor' },
          { model: Voucher, as: 'voucher', include: [
            { model: Disaster, as: 'disaster' }
          ]},
          { model: ProofOfAid, as: 'proof' }
        ]
      });
      
      // Cache for 2 minutes
      await cache.set(cacheKey, transactions, 120);
    }
    
    return transactions;
  }

  async getTransactionByHash(txHash) {
    const cacheKey = `transaction:${txHash}`;
    
    // Try cache first
    let transaction = await cache.get(cacheKey);
    
    if (!transaction) {
      transaction = await Transaction.findOne({
        where: { txHash },
        include: [
          { model: Vendor, as: 'vendor' },
          { model: Voucher, as: 'voucher' },
          { model: ProofOfAid, as: 'proof' }
        ]
      });
      
      // Cache for 10 minutes
      if (transaction) {
        await cache.set(cacheKey, transaction, 600);
      }
    }
    
    return transaction;
  }

  async createTransaction(transactionData) {
    const transaction = await Transaction.create(transactionData);
    
    // Clear cache
    await cache.deletePattern('transactions:*');
    await cache.delete(`vendor:${transaction.vendorAddress}`);
    await cache.delete(`voucher:${transaction.voucherId}`);
    
    return transaction;
  }

  // Proof of Aid operations with caching
  async getProofsOfAid(transactionId) {
    const cacheKey = `proofs:${transactionId}`;
    
    // Try cache first
    let proofs = await cache.get(cacheKey);
    
    if (!proofs) {
      proofs = await ProofOfAid.findAll({
        where: { transactionId },
        order: [['createdAt', 'DESC']]
      });
      
      // Cache for 10 minutes
      await cache.set(cacheKey, proofs, 600);
    }
    
    return proofs;
  }

  async createProofOfAid(proofData) {
    const proof = await ProofOfAid.create(proofData);
    
    // Clear cache
    await cache.deletePattern('proofs:*');
    await cache.delete(`transaction:${proof.transactionId}`);
    
    return proof;
  }

  // Analytics operations with caching
  async getDisasterStats(zoneId) {
    const cacheKey = `stats:disaster:${zoneId}`;
    
    // Try cache first
    let stats = await cache.get(cacheKey);
    
    if (!stats) {
      const disaster = await Disaster.findOne({
        where: { zoneId },
        include: [
          { model: Vendor, as: 'vendors' },
          { model: Voucher, as: 'vouchers' },
          { model: Transaction, as: 'transactions' }
        ]
      });
      
      if (!disaster) return null;
      
      stats = {
        zoneId: disaster.zoneId,
        name: disaster.name,
        initialFunding: disaster.initialFunding,
        currentFunding: disaster.currentFunding,
        totalSpent: disaster.totalSpent,
        vendorCount: disaster.vendors.length,
        voucherCount: disaster.vouchers.length,
        transactionCount: disaster.transactions.length,
        status: disaster.status,
        createdAt: disaster.createdAt
      };
      
      // Cache for 5 minutes
      await cache.set(cacheKey, stats, 300);
    }
    
    return stats;
  }

  async getGlobalStats() {
    const cacheKey = 'stats:global';
    
    // Try cache first
    let stats = await cache.get(cacheKey);
    
    if (!stats) {
      const disasterCount = await Disaster.count();
      const vendorCount = await Vendor.count();
      const voucherCount = await Voucher.count();
      const transactionCount = await Transaction.count();
      
      const totalFundingResult = await Disaster.sum('initialFunding') || 0;
      const totalSpentResult = await Disaster.sum('totalSpent') || 0;
      
      stats = {
        disasterCount,
        vendorCount,
        voucherCount,
        transactionCount,
        totalFunding: totalFundingResult,
        totalSpent: totalSpentResult,
        remainingFunds: totalFundingResult - totalSpentResult
      };
      
      // Cache for 10 minutes
      await cache.set(cacheKey, stats, 600);
    }
    
    return stats;
  }

  // Analytics cache operations
  async getCachedAnalytics(key) {
    try {
      const cached = await AnalyticsCache.findOne({
        where: { 
          cacheKey: key,
          expiresAt: { [sequelize.Op.gt]: new Date() }
        }
      });
      
      if (cached) {
        return cached.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached analytics:', error);
      return null;
    }
  }

  async setCachedAnalytics(key, data, expirationSeconds = 3600) {
    try {
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + expirationSeconds);
      
      await AnalyticsCache.upsert({
        cacheKey: key,
        data,
        expiresAt
      });
      
      return true;
    } catch (error) {
      console.error('Error setting cached analytics:', error);
      return false;
    }
  }

  // Database health check
  async healthCheck() {
    try {
      await sequelize.authenticate();
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }
}

module.exports = new DataService();