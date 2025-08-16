const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Cache = sequelize.define('Cache', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('value');
      try {
        return JSON.parse(value);
      } catch (error) {
        return value; // Return as string if not JSON
      }
    },
    set(value) {
      if (typeof value === 'object') {
        this.setDataValue('value', JSON.stringify(value));
      } else {
        this.setDataValue('value', String(value));
      }
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (value && !Array.isArray(value)) {
          throw new Error('Tags must be an array');
        }
      }
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'cache',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['expires_at'] },
    { fields: ['created_at'] }
  ]
});

// Instance methods
Cache.prototype.isExpired = function() {
  return this.expires_at && this.expires_at < new Date();
};

Cache.prototype.isValid = function() {
  return !this.isExpired();
};

Cache.prototype.extend = async function(seconds) {
  if (seconds) {
    this.expires_at = new Date(Date.now() + seconds * 1000);
  } else {
    this.expires_at = null; // Never expires
  }
  return await this.save();
};

Cache.prototype.addTag = async function(tag) {
  const currentTags = this.tags || [];
  if (!currentTags.includes(tag)) {
    currentTags.push(tag);
    this.tags = currentTags;
    return await this.save();
  }
  return this;
};

Cache.prototype.removeTag = async function(tag) {
  const currentTags = this.tags || [];
  const index = currentTags.indexOf(tag);
  if (index > -1) {
    currentTags.splice(index, 1);
    this.tags = currentTags;
    return await this.save();
  }
  return this;
};

Cache.prototype.hasTag = function(tag) {
  const currentTags = this.tags || [];
  return currentTags.includes(tag);
};

// Class methods
Cache.set = async function(key, value, ttlSeconds = null, tags = []) {
  const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null;
  
  const [cacheEntry] = await this.upsert({
    key,
    value,
    tags: Array.isArray(tags) ? tags : [tags],
    expires_at: expiresAt
  });
  
  return cacheEntry;
};

Cache.get = async function(key) {
  const cacheEntry = await this.findByPk(key);
  
  if (!cacheEntry) {
    return null;
  }
  
  if (cacheEntry.isExpired()) {
    await cacheEntry.destroy();
    return null;
  }
  
  return cacheEntry.value;
};

Cache.has = async function(key) {
  const cacheEntry = await this.findByPk(key);
  return cacheEntry && cacheEntry.isValid();
};

Cache.forget = async function(key) {
  const deleted = await this.destroy({
    where: { key }
  });
  return deleted > 0;
};

Cache.remember = async function(key, ttlSeconds, callback) {
  let value = await this.get(key);
  
  if (value === null) {
    value = await callback();
    await this.set(key, value, ttlSeconds);
  }
  
  return value;
};

Cache.flush = async function() {
  return await this.destroy({
    where: {},
    truncate: true
  });
};

Cache.flushByTag = async function(tag) {
  return await this.destroy({
    where: {
      tags: {
        [sequelize.Sequelize.Op.contains]: [tag]
      }
    }
  });
};

Cache.flushByTags = async function(tags) {
  return await this.destroy({
    where: {
      tags: {
        [sequelize.Sequelize.Op.overlap]: tags
      }
    }
  });
};

Cache.cleanupExpired = async function() {
  return await this.destroy({
    where: {
      expires_at: {
        [sequelize.Sequelize.Op.lt]: new Date()
      }
    }
  });
};

Cache.getByTag = async function(tag) {
  return await this.findAll({
    where: {
      tags: {
        [sequelize.Sequelize.Op.contains]: [tag]
      },
      [sequelize.Sequelize.Op.or]: [
        { expires_at: null },
        { expires_at: { [sequelize.Sequelize.Op.gt]: new Date() } }
      ]
    }
  });
};

Cache.getCacheStats = async function() {
  const [total, expired, tagged] = await Promise.all([
    this.count(),
    this.count({
      where: {
        expires_at: {
          [sequelize.Sequelize.Op.lt]: new Date()
        }
      }
    }),
    this.count({
      where: {
        tags: {
          [sequelize.Sequelize.Op.ne]: []
        }
      }
    })
  ]);
  
  return {
    total,
    valid: total - expired,
    expired,
    tagged
  };
};

Cache.increment = async function(key, amount = 1, ttlSeconds = null) {
  const current = await this.get(key);
  let newValue = amount;
  
  if (current !== null && typeof current === 'number') {
    newValue = current + amount;
  }
  
  await this.set(key, newValue, ttlSeconds);
  return newValue;
};

Cache.decrement = async function(key, amount = 1, ttlSeconds = null) {
  return await this.increment(key, -amount, ttlSeconds);
};

Cache.many = async function(keys) {
  const cacheEntries = await this.findAll({
    where: {
      key: {
        [sequelize.Sequelize.Op.in]: keys
      }
    }
  });
  
  const result = {};
  const now = new Date();
  
  for (const entry of cacheEntries) {
    if (!entry.isExpired()) {
      result[entry.key] = entry.value;
    } else {
      // Clean up expired entries
      await entry.destroy();
    }
  }
  
  return result;
};

Cache.putMany = async function(items, ttlSeconds = null) {
  const operations = Object.entries(items).map(([key, value]) => 
    this.set(key, value, ttlSeconds)
  );
  
  return await Promise.all(operations);
};

// Hooks for automatic cleanup
Cache.afterFind((result) => {
  // Automatically clean up expired entries when found
  if (result && !Array.isArray(result) && result.isExpired()) {
    setImmediate(() => result.destroy().catch(() => {}));
  }
});

module.exports = Cache;
