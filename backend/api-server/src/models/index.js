const fs = require('fs');
const path = require('path');
const { sequelize } = require('../database/connection');

// Import all models
const Disaster = require('./Disaster');
const Vendor = require('./Vendor');
const Voucher = require('./Voucher');
const Transaction = require('./Transaction');
const ProofOfAid = require('./ProofOfAid');
const AnalyticsCache = require('./AnalyticsCache');

// Define associations
Disaster.hasMany(Vendor, { foreignKey: 'disasterZoneId', as: 'vendors' });
Vendor.belongsTo(Disaster, { foreignKey: 'disasterZoneId', as: 'disaster' });

Disaster.hasMany(Voucher, { foreignKey: 'disasterZoneId', as: 'vouchers' });
Voucher.belongsTo(Disaster, { foreignKey: 'disasterZoneId', as: 'disaster' });

Vendor.hasMany(Transaction, { foreignKey: 'vendorAddress', as: 'transactions' });
Transaction.belongsTo(Vendor, { foreignKey: 'vendorAddress', as: 'vendor' });

Voucher.hasMany(Transaction, { foreignKey: 'voucherId', as: 'transactions' });
Transaction.belongsTo(Voucher, { foreignKey: 'voucherId', as: 'voucher' });

Transaction.hasOne(ProofOfAid, { foreignKey: 'transactionId', as: 'proof' });
ProofOfAid.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });

// Export models and sequelize instance
module.exports = {
  sequelize,
  Disaster,
  Vendor,
  Voucher,
  Transaction,
  ProofOfAid,
  AnalyticsCache
};