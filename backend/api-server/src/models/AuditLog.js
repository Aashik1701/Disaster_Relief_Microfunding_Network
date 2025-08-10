const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  walletAddress: {
    type: DataTypes.STRING(42),
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  resource: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  resourceId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  oldValues: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('oldValues');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('oldValues', JSON.stringify(value));
    }
  },
  newValues: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('newValues');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('newValues', JSON.stringify(value));
    }
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('metadata');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('metadata', JSON.stringify(value));
    }
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  indexes: [
    { fields: ['userId'] },
    { fields: ['walletAddress'] },
    { fields: ['action'] },
    { fields: ['resource'] },
    { fields: ['resourceId'] },
    { fields: ['createdAt'] },
    { fields: ['success'] }
  ]
});

// Class methods
AuditLog.logAction = async function(data) {
  try {
    return await this.create({
      userId: data.userId || null,
      walletAddress: data.walletAddress || null,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId || null,
      oldValues: data.oldValues || null,
      newValues: data.newValues || null,
      metadata: data.metadata || {},
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      success: data.success !== false,
      errorMessage: data.errorMessage || null
    });
  } catch (error) {
    console.error('Failed to create audit log entry:', error);
    return null;
  }
};

AuditLog.getActionHistory = function(resource, resourceId, limit = 50) {
  return this.findAll({
    where: { resource, resourceId },
    order: [['createdAt', 'DESC']],
    limit
  });
};

AuditLog.getUserHistory = function(userId, limit = 100) {
  return this.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit
  });
};

module.exports = AuditLog;
