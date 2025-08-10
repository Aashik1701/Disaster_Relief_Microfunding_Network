const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Voucher = sequelize.define('Voucher', {
  voucherId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  beneficiary: {
    type: DataTypes.STRING(42),
    allowNull: false
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
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
    type: process.env.NODE_ENV === 'development' || !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('username:password') 
      ? DataTypes.JSON 
      : DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  txHash: DataTypes.STRING(66)
}, {
  tableName: 'vouchers'
});

module.exports = Voucher;