const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('disaster_alert', 'voucher_received', 'payment_sent', 'verification_update', 'system_update', 'emergency', 'payment_received', 'vendor_approved'),
    allowNull: false,
    validate: {
      isIn: [['disaster_alert', 'voucher_received', 'payment_sent', 'verification_update', 'system_update', 'emergency', 'payment_received', 'vendor_approved']]
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 2000]
    }
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('data');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('data', value ? JSON.stringify(value) : null);
    }
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
    validate: {
      isIn: [['low', 'medium', 'high', 'critical']]
    }
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  action_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sent_via: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['type'] },
    { fields: ['priority'] },
    { fields: ['read_at'] },
    { fields: ['created_at'] },
    { fields: ['expires_at'] }
  ],
  scopes: {
    unread: {
      where: {
        read_at: null
      }
    },
    highPriority: {
      where: {
        priority: ['high', 'critical']
      }
    },
    recent: {
      order: [['created_at', 'DESC']],
      limit: 50
    },
    active: {
      where: {
        [sequelize.Sequelize.Op.or]: [
          { expires_at: null },
          { expires_at: { [sequelize.Sequelize.Op.gt]: new Date() } }
        ]
      }
    }
  }
});

// Instance methods
Notification.prototype.markAsRead = function() {
  this.read_at = new Date();
  return this.save();
};

Notification.prototype.isExpired = function() {
  return this.expires_at && this.expires_at < new Date();
};

Notification.prototype.isRead = function() {
  return this.read_at !== null;
};

// Class methods
Notification.createForUser = async function(userId, notificationData) {
  return await this.create({
    user_id: userId,
    ...notificationData
  });
};

Notification.markAllAsReadForUser = async function(userId) {
  return await this.update(
    { read_at: new Date() },
    { 
      where: { 
        user_id: userId,
        read_at: null
      }
    }
  );
};

Notification.getUnreadCountForUser = async function(userId) {
  return await this.count({
    where: {
      user_id: userId,
      read_at: null,
      [sequelize.Sequelize.Op.or]: [
        { expires_at: null },
        { expires_at: { [sequelize.Sequelize.Op.gt]: new Date() } }
      ]
    }
  });
};

Notification.cleanupExpired = async function() {
  return await this.destroy({
    where: {
      expires_at: {
        [sequelize.Sequelize.Op.lt]: new Date()
      }
    }
  });
};

module.exports = Notification;
