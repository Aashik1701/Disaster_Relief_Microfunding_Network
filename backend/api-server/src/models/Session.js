const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
const crypto = require('crypto');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => crypto.randomUUID()
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  wallet_address: {
    type: DataTypes.STRING(42),
    allowNull: false,
    validate: {
      len: [42, 42],
      isEthereumAddress(value) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
          throw new Error('Invalid Ethereum address format');
        }
      }
    }
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIP: true
    }
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  device_fingerprint: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_activity: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => new Date()
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24); // 24 hour default expiry
      return expiry;
    }
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('data');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('data', value ? JSON.stringify(value) : null);
    }
  }
}, {
  tableName: 'sessions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['wallet_address'] },
    { fields: ['is_active'] },
    { fields: ['expires_at'] },
    { fields: ['last_activity'] }
  ],
  scopes: {
    active: {
      where: {
        is_active: true,
        expires_at: {
          [sequelize.Sequelize.Op.gt]: new Date()
        }
      }
    }
  }
});

// Instance methods
Session.prototype.isExpired = function() {
  return this.expires_at < new Date();
};

Session.prototype.isValid = function() {
  return this.is_active && !this.isExpired();
};

Session.prototype.updateActivity = async function() {
  this.last_activity = new Date();
  return await this.save();
};

Session.prototype.extend = async function(hours = 24) {
  const newExpiry = new Date();
  newExpiry.setHours(newExpiry.getHours() + hours);
  this.expires_at = newExpiry;
  return await this.save();
};

Session.prototype.invalidate = async function() {
  this.is_active = false;
  return await this.save();
};

Session.prototype.setData = async function(key, value) {
  const currentData = this.data || {};
  currentData[key] = value;
  this.data = currentData;
  return await this.save();
};

Session.prototype.getData = function(key) {
  const currentData = this.data || {};
  return key ? currentData[key] : currentData;
};

Session.prototype.removeData = async function(key) {
  const currentData = this.data || {};
  delete currentData[key];
  this.data = currentData;
  return await this.save();
};

// Class methods
Session.createSession = async function(userId, walletAddress, options = {}) {
  const session = await this.create({
    user_id: userId,
    wallet_address: walletAddress,
    ip_address: options.ipAddress,
    user_agent: options.userAgent,
    device_fingerprint: options.deviceFingerprint,
    expires_at: options.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });
  
  return session;
};

Session.findValidSession = async function(sessionId) {
  return await this.findOne({
    where: {
      id: sessionId,
      is_active: true,
      expires_at: {
        [sequelize.Sequelize.Op.gt]: new Date()
      }
    },
    include: [{
      model: sequelize.models.User,
      as: 'user',
      attributes: ['id', 'wallet_address', 'email', 'role', 'status']
    }]
  });
};

Session.findByWalletAddress = async function(walletAddress, activeOnly = true) {
  const whereClause = {
    wallet_address: walletAddress
  };
  
  if (activeOnly) {
    whereClause.is_active = true;
    whereClause.expires_at = {
      [sequelize.Sequelize.Op.gt]: new Date()
    };
  }
  
  return await this.findAll({
    where: whereClause,
    order: [['last_activity', 'DESC']]
  });
};

Session.invalidateAllForUser = async function(userId, exceptSessionId = null) {
  const whereClause = {
    user_id: userId,
    is_active: true
  };
  
  if (exceptSessionId) {
    whereClause.id = {
      [sequelize.Sequelize.Op.ne]: exceptSessionId
    };
  }
  
  return await this.update(
    { is_active: false },
    { where: whereClause }
  );
};

Session.cleanupExpired = async function() {
  return await this.destroy({
    where: {
      [sequelize.Sequelize.Op.or]: [
        { is_active: false },
        { expires_at: { [sequelize.Sequelize.Op.lt]: new Date() } }
      ]
    }
  });
};

Session.getActiveSessionsCount = async function(userId = null) {
  const whereClause = {
    is_active: true,
    expires_at: {
      [sequelize.Sequelize.Op.gt]: new Date()
    }
  };
  
  if (userId) {
    whereClause.user_id = userId;
  }
  
  return await this.count({ where: whereClause });
};

Session.getSessionStats = async function() {
  const [totalSessions, activeSessions, expiredSessions] = await Promise.all([
    this.count(),
    this.count({
      where: {
        is_active: true,
        expires_at: {
          [sequelize.Sequelize.Op.gt]: new Date()
        }
      }
    }),
    this.count({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { is_active: false },
          { expires_at: { [sequelize.Sequelize.Op.lt]: new Date() } }
        ]
      }
    })
  ]);
  
  return {
    total: totalSessions,
    active: activeSessions,
    expired: expiredSessions
  };
};

// Hooks
Session.beforeCreate(async (session) => {
  // Ensure session ID is unique
  if (!session.id) {
    session.id = crypto.randomUUID();
  }
});

module.exports = Session;
