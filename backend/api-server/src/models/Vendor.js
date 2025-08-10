const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Vendor = sequelize.define('Vendor', {
  walletAddress: {
    type: DataTypes.STRING(42),
    unique: true,
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: DataTypes.STRING,
  disasterZoneId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  kycIpfsHash: DataTypes.STRING,
  totalRedeemed: {
    type: DataTypes.DECIMAL(20, 6),
    defaultValue: 0
  },
  transactionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reputationScore: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  }
}, {
  tableName: 'vendors'
});

module.exports = Vendor;