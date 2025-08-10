const { 
  sequelize, 
  User,
  Disaster, 
  Vendor, 
  Voucher, 
  Transaction, 
  ProofOfAid,
  AnalyticsCache,
  AuditLog,
  SystemSettings
} = require('../models');
const cache = require('./cacheService');

class DataService {
  // User operations with caching
  async getUsers(options = {}) {
    const { page = 1, limit = 10, role, status } = options;
    const cacheKey = `users:${page}:${limit}:${role || 'all'}:${status || 'all'}`;
    
    // Try cache first
    let users = await cache.get(cacheKey);
    
    if (!users) {
      const whereClause = {};
      if (role) whereClause.role = role;
      if (status) whereClause.status = status;
      
      users = await User.findAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['verificationData'] } // Don't include sensitive data
      });
      
      // Cache for 5 minutes
      await cache.set(cacheKey, users, 300);
    }
    
    return users;
  }

  async getUserByWallet(walletAddress) {
    const cacheKey = `user:wallet:${walletAddress.toLowerCase()}`;
    
    // Try cache first
    let user = await cache.get(cacheKey);
    
    if (!user) {
      user = await User.findByWallet(walletAddress);
      
      // Cache for 10 minutes
      if (user) {
        await cache.set(cacheKey, user.toSafeJSON(), 600);
      }
    }
    
    return user;
  }

  async getUserById(userId) {
    const cacheKey = `user:id:${userId}`;
    
    // Try cache first
    let user = await cache.get(cacheKey);
    
    if (!user) {
      user = await User.findByPk(userId, {
        attributes: { exclude: ['verificationData'] }
      });
      
      // Cache for 10 minutes
      if (user) {
        await cache.set(cacheKey, user, 600);
      }
    }
    
    return user;
  }

  async createUser(userData, auditData = {}) {
    const user = await User.create(userData);
    
    // Log the action
    await this.logAction({
      action: 'CREATE',
      resource: 'user',
      resourceId: user.id,
      newValues: user.toSafeJSON(),
      ...auditData
    });
    
    // Clear cache
    await cache.deletePattern('users:*');
    await cache.delete(`user:wallet:${user.walletAddress}`);
    await cache.delete(`user:id:${user.id}`);
    
    return user;
  }

  async updateUser(userId, updates, auditData = {}) {
    const oldUser = await User.findByPk(userId);
    if (!oldUser) return null;
    
    await User.update(updates, { where: { id: userId } });
    const updatedUser = await User.findByPk(userId);
    
    // Log the action
    await this.logAction({
      action: 'UPDATE',
      resource: 'user',
      resourceId: userId,
      oldValues: oldUser.toSafeJSON(),
      newValues: updatedUser.toSafeJSON(),
      ...auditData
    });
    
    // Clear cache
    await cache.deletePattern('users:*');
    await cache.delete(`user:wallet:${oldUser.walletAddress}`);
    await cache.delete(`user:id:${userId}`);
    
    return updatedUser;
  }

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
          { model: User, as: 'creator', attributes: ['id', 'name', 'walletAddress'] },
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

  // Audit logging operations
  async logAction(data) {
    try {
      return await AuditLog.logAction(data);
    } catch (error) {
      console.error('Error logging action:', error);
      return null;
    }
  }

  async getAuditLogs(options = {}) {
    const { page = 1, limit = 50, userId, action, resource, success } = options;
    const cacheKey = `audit:${page}:${limit}:${userId || 'all'}:${action || 'all'}:${resource || 'all'}:${success || 'all'}`;
    
    // Try cache first
    let logs = await cache.get(cacheKey);
    
    if (!logs) {
      const whereClause = {};
      if (userId) whereClause.userId = userId;
      if (action) whereClause.action = action;
      if (resource) whereClause.resource = resource;
      if (success !== undefined) whereClause.success = success;
      
      logs = await AuditLog.findAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'walletAddress'] }
        ]
      });
      
      // Cache for 2 minutes
      await cache.set(cacheKey, logs, 120);
    }
    
    return logs;
  }

  async getUserAuditHistory(userId, limit = 100) {
    return await AuditLog.getUserHistory(userId, limit);
  }

  async getResourceAuditHistory(resource, resourceId, limit = 50) {
    return await AuditLog.getActionHistory(resource, resourceId, limit);
  }

  // System settings operations
  async getSystemSetting(key, defaultValue = null) {
    const cacheKey = `setting:${key}`;
    
    // Try cache first
    let value = await cache.get(cacheKey);
    
    if (value === null || value === undefined) {
      value = await SystemSettings.getSetting(key, defaultValue);
      
      // Cache for 30 minutes
      await cache.set(cacheKey, value, 1800);
    }
    
    return value;
  }

  async setSystemSetting(key, value, type = 'string', description = null, category = 'general', userId = null) {
    const setting = await SystemSettings.setSetting(key, value, type, description, category, userId);
    
    // Clear cache
    await cache.delete(`setting:${key}`);
    await cache.deletePattern('settings:*');
    
    // Log the action
    if (userId) {
      await this.logAction({
        userId,
        action: 'UPDATE_SETTING',
        resource: 'system_setting',
        resourceId: key,
        newValues: { key, value, type, description, category },
        metadata: { setting_key: key }
      });
    }
    
    return setting;
  }

  async getSystemSettings(category = null) {
    const cacheKey = `settings:${category || 'all'}`;
    
    // Try cache first
    let settings = await cache.get(cacheKey);
    
    if (!settings) {
      if (category) {
        settings = await SystemSettings.getCategory(category);
      } else {
        settings = await SystemSettings.getAllSettings();
      }
      
      // Cache for 30 minutes
      await cache.set(cacheKey, settings, 1800);
    }
    
    return settings;
  }

  // Bulk operations
  async bulkCreateUsers(usersData, auditData = {}) {
    const users = await User.bulkCreate(usersData, { 
      returning: true,
      validate: true 
    });
    
    // Log the action
    await this.logAction({
      action: 'BULK_CREATE',
      resource: 'user',
      newValues: { count: users.length, userIds: users.map(u => u.id) },
      ...auditData
    });
    
    // Clear cache
    await cache.deletePattern('users:*');
    
    return users;
  }

  async bulkUpdateUsers(whereClause, updates, auditData = {}) {
    const [affectedCount] = await User.update(updates, { 
      where: whereClause,
      returning: false 
    });
    
    // Log the action
    await this.logAction({
      action: 'BULK_UPDATE',
      resource: 'user',
      newValues: { affectedCount, updates, whereClause },
      ...auditData
    });
    
    // Clear cache
    await cache.deletePattern('users:*');
    
    return affectedCount;
  }

  // Advanced analytics
  async getUserStatsByRole() {
    const cacheKey = 'stats:users:by_role';
    
    let stats = await cache.get(cacheKey);
    
    if (!stats) {
      stats = await User.findAll({
        attributes: [
          'role',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['role']
      });
      
      // Cache for 15 minutes
      await cache.set(cacheKey, stats, 900);
    }
    
    return stats;
  }

  async getTransactionStatsByPeriod(period = 'day', limit = 30) {
    const cacheKey = `stats:transactions:${period}:${limit}`;
    
    let stats = await cache.get(cacheKey);
    
    if (!stats) {
      let dateFormat;
      switch (period) {
        case 'hour':
          dateFormat = '%Y-%m-%d %H:00:00';
          break;
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-W%u';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        default:
          dateFormat = '%Y-%m-%d';
      }
      
      stats = await Transaction.findAll({
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('timestamp'), dateFormat), 'period'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'transaction_count'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
        ],
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('timestamp'), dateFormat)],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('timestamp'), dateFormat), 'DESC']],
        limit: parseInt(limit)
      });
      
      // Cache for 10 minutes
      await cache.set(cacheKey, stats, 600);
    }
    
    return stats;
  }

  // Cleanup operations
  async cleanupExpiredCache() {
    try {
      const expired = await AnalyticsCache.destroy({
        where: {
          expiresAt: { [sequelize.Op.lt]: new Date() }
        }
      });
      
      console.log(`Cleaned up ${expired} expired cache entries`);
      return expired;
    } catch (error) {
      console.error('Error cleaning up expired cache:', error);
      return 0;
    }
  }

  async cleanupOldAuditLogs(retentionDays = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      const deleted = await AuditLog.destroy({
        where: {
          createdAt: { [sequelize.Op.lt]: cutoffDate }
        }
      });
      
      console.log(`Cleaned up ${deleted} old audit log entries`);
      return deleted;
    } catch (error) {
      console.error('Error cleaning up old audit logs:', error);
      return 0;
    }
  }
}

module.exports = new DataService();