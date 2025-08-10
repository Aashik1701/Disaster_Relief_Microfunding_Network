const fs = require('fs');
const path = require('path');
const { sequelize } = require('../database/connection');

// Import all models
const User = require('./User');
const Disaster = require('./Disaster');
const Vendor = require('./Vendor');
const Voucher = require('./Voucher');
const Transaction = require('./Transaction');
const ProofOfAid = require('./ProofOfAid');
const AnalyticsCache = require('./AnalyticsCache');
const AuditLog = require('./AuditLog');
const SystemSettings = require('./SystemSettings');

// Define associations
// User associations
User.hasMany(Disaster, { foreignKey: 'createdBy', as: 'createdDisasters' });
Disaster.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Disaster associations
Disaster.hasMany(Vendor, { foreignKey: 'disasterZoneId', as: 'vendors' });
Vendor.belongsTo(Disaster, { foreignKey: 'disasterZoneId', as: 'disaster' });

Disaster.hasMany(Voucher, { foreignKey: 'disasterZoneId', as: 'vouchers' });
Voucher.belongsTo(Disaster, { foreignKey: 'disasterZoneId', as: 'disaster' });

// Vendor associations
Vendor.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Vendor, { foreignKey: 'userId', as: 'vendorProfile' });

Vendor.hasMany(Transaction, { foreignKey: 'vendorAddress', as: 'transactions' });
Transaction.belongsTo(Vendor, { foreignKey: 'vendorAddress', as: 'vendor' });

// Voucher associations
Voucher.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
User.hasMany(Voucher, { foreignKey: 'recipientId', as: 'vouchers' });

Voucher.hasMany(Transaction, { foreignKey: 'voucherId', as: 'transactions' });
Transaction.belongsTo(Voucher, { foreignKey: 'voucherId', as: 'voucher' });

// Transaction associations
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });

Transaction.hasOne(ProofOfAid, { foreignKey: 'transactionId', as: 'proof' });
ProofOfAid.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });

// Export models and sequelize instance
module.exports = {
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
};