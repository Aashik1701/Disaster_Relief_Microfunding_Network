const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const AnalyticsCache = sequelize.define('analytics_cache', {
  cacheKey: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = AnalyticsCache;