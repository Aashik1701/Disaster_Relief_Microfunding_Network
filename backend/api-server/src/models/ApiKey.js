const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
const crypto = require('crypto');

const ApiKey = sequelize.define('ApiKey', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  key_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  prefix: {
    type: DataTypes.STRING(8),
    allowNull: false
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Permissions must be an array');
        }
      }
    }
  },
  rate_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    validate: {
      min: 1,
      max: 10000
    }
  },
  last_used: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ip_whitelist: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    validate: {
      isValidIpList(value) {
        if (value && !Array.isArray(value)) {
          throw new Error('IP whitelist must be an array');
        }
      }
    }
  }
}, {
  tableName: 'api_keys',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['key_hash'], unique: true },
    { fields: ['user_id'] },
    { fields: ['is_active'] },
    { fields: ['expires_at'] }
  ],
  scopes: {
    active: {
      where: {
        is_active: true,
        [sequelize.Sequelize.Op.or]: [
          { expires_at: null },
          { expires_at: { [sequelize.Sequelize.Op.gt]: new Date() } }
        ]
      }
    }
  }
});

// Instance methods
ApiKey.prototype.isExpired = function() {
  return this.expires_at && this.expires_at < new Date();
};

ApiKey.prototype.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.permissions.includes('*');
};

ApiKey.prototype.isIpAllowed = function(ip) {
  if (!this.ip_whitelist || this.ip_whitelist.length === 0) {
    return true; // No IP restriction
  }
  return this.ip_whitelist.includes(ip);
};

ApiKey.prototype.recordUsage = async function() {
  this.usage_count += 1;
  this.last_used = new Date();
  return await this.save();
};

ApiKey.prototype.deactivate = async function() {
  this.is_active = false;
  return await this.save();
};

ApiKey.prototype.updatePermissions = async function(permissions) {
  this.permissions = permissions;
  return await this.save();
};

// Class methods
ApiKey.generateKey = function() {
  const key = crypto.randomBytes(32).toString('hex');
  const prefix = key.substring(0, 8);
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');
  
  return {
    key: `drn_${key}`, // Disaster Relief Network prefix
    prefix,
    keyHash
  };
};

ApiKey.createApiKey = async function(data) {
  const { key, prefix, keyHash } = this.generateKey();
  
  const apiKey = await this.create({
    ...data,
    key_hash: keyHash,
    prefix
  });
  
  // Return the plain key only once
  return {
    apiKey,
    plainKey: key
  };
};

ApiKey.findByKey = async function(key) {
  if (!key || !key.startsWith('drn_')) {
    return null;
  }
  
  const cleanKey = key.replace('drn_', '');
  const keyHash = crypto.createHash('sha256').update(cleanKey).digest('hex');
  
  return await this.findOne({
    where: {
      key_hash: keyHash,
      is_active: true
    },
    include: [{
      model: sequelize.models.User,
      as: 'user',
      attributes: ['id', 'wallet_address', 'email', 'role']
    }]
  });
};

ApiKey.cleanupExpired = async function() {
  return await this.update(
    { is_active: false },
    {
      where: {
        expires_at: {
          [sequelize.Sequelize.Op.lt]: new Date()
        },
        is_active: true
      }
    }
  );
};

// Hooks
ApiKey.beforeCreate(async (apiKey) => {
  // Ensure prefix matches key_hash
  if (!apiKey.prefix) {
    throw new Error('Prefix is required');
  }
});

module.exports = ApiKey;
