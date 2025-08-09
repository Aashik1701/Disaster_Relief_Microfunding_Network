const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Voucher = sequelize.define('voucher', {
  voucherId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  beneficiary: {
    type: DataTypes.STRING(42),
    allowNull: false
  },
  disasterZoneId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(20, 6),
    allowNull: false
  },
  expiryTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allowedCategories: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  txHash: DataTypes.STRING(66)
});

module.exports = Voucher;