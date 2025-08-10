const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  wallet_address: {
    type: DataTypes.STRING(42),
    unique: true,
    allowNull: false,
    validate: {
      is: /^0x[a-fA-F0-9]{40}$/
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'donor', 'victim', 'vendor', 'government', 'treasury', 'oracle'),
    allowNull: false,
    defaultValue: 'donor'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending', 'suspended'),
    defaultValue: 'active'
  },
  profile_data: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('profile_data');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('profile_data', JSON.stringify(value));
    }
  },
  verification_status: {
    type: DataTypes.ENUM('unverified', 'pending', 'verified', 'rejected'),
    defaultValue: 'unverified'
  },
  verification_data: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('verification_data');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('verification_data', JSON.stringify(value));
    }
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  login_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  locked_until: {
    type: DataTypes.DATE,
    allowNull: true
  },
  preferences: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('preferences');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('preferences', JSON.stringify(value));
    }
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['wallet_address'] },
    { fields: ['email'] },
    { fields: ['role'] },
    { fields: ['status'] },
    { fields: ['verification_status'] }
  ],
  hooks: {
    beforeCreate: async (user) => {
      // Normalize wallet address
      if (user.wallet_address) {
        user.wallet_address = user.wallet_address.toLowerCase();
      }
    },
    beforeUpdate: async (user) => {
      // Normalize wallet address
      if (user.wallet_address) {
        user.wallet_address = user.wallet_address.toLowerCase();
      }
    }
  }
});

// Instance methods
User.prototype.isLocked = function() {
  return !!(this.locked_until && this.locked_until > Date.now());
};

User.prototype.incrementLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.locked_until && this.locked_until < Date.now()) {
    return this.update({
      login_attempts: 1,
      locked_until: null
    });
  }
  
  const updates = { login_attempts: this.login_attempts + 1 };
  
  // Lock account after 5 failed attempts for 15 minutes
  if (this.login_attempts + 1 >= 5 && !this.isLocked()) {
    updates.locked_until = Date.now() + 15 * 60 * 1000; // 15 minutes
  }
  
  return this.update(updates);
};

User.prototype.resetLoginAttempts = async function() {
  return this.update({
    login_attempts: 0,
    locked_until: null
  });
};

User.prototype.updateLastLogin = async function() {
  return this.update({ last_login: new Date() });
};

User.prototype.toSafeJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.verification_data;
  return values;
};

// Class methods
User.findByWallet = function(walletAddress) {
  return this.findOne({
    where: { wallet_address: walletAddress.toLowerCase() }
  });
};

User.findByEmail = function(email) {
  return this.findOne({
    where: { email: email.toLowerCase() }
  });
};

User.findByRole = function(role) {
  return this.findAll({
    where: { role, status: 'active' }
  });
};

module.exports = User;
