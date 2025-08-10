const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Transaction = sequelize.define('Transaction', {
  txHash: {
    type: DataTypes.STRING(66),
    unique: true,
    allowNull: false
  },
  voucherId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vendorAddress: {
    type: DataTypes.STRING(42),
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  beneficiary: DataTypes.STRING(42),
  amount: {
    type: DataTypes.DECIMAL(20, 6),
    allowNull: false
  },
  category: DataTypes.STRING(100),
  ipfsProofHash: DataTypes.STRING(255),
  latitude: DataTypes.DECIMAL(10, 8),
  longitude: DataTypes.DECIMAL(11, 8),
  blockNumber: DataTypes.BIGINT,
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'confirmed'
  }
}, {
  tableName: 'transactions'
});

module.exports = Transaction;