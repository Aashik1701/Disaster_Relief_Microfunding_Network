const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Disaster = sequelize.define('Disaster', {
  zoneId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8), 
    allowNull: false
  },
  radius: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  initialFunding: {
    type: DataTypes.DECIMAL(20, 6),
    defaultValue: 0
  },
  currentFunding: {
    type: DataTypes.DECIMAL(20, 6),
    defaultValue: 0
  },
  totalSpent: {
    type: DataTypes.DECIMAL(20, 6),
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active'
  },
  txHash: DataTypes.STRING(66),
  createdBy: DataTypes.INTEGER
}, {
  tableName: 'disasters'
});

module.exports = Disaster;