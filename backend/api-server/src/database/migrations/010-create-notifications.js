const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Notifications table
    await queryInterface.createTable('notifications', {
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
        },
        onDelete: 'CASCADE'
      },
      type: {
        type: DataTypes.ENUM('disaster_alert', 'voucher_received', 'payment_sent', 'verification_update', 'system_update', 'emergency', 'payment_received', 'vendor_approved'),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'JSON data related to notification'
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium'
      },
      read_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      action_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      sent_via: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Channels through which notification was sent (email, sms, push)'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Create indexes for Notifications table
    await queryInterface.addIndex('notifications', ['user_id']);
    await queryInterface.addIndex('notifications', ['type']);
    await queryInterface.addIndex('notifications', ['priority']);
    await queryInterface.addIndex('notifications', ['read_at']);
    await queryInterface.addIndex('notifications', ['created_at']);
    await queryInterface.addIndex('notifications', ['expires_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('notifications');
  }
};
