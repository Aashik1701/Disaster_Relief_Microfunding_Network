const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Users table
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      wallet_address: {
        type: DataTypes.STRING(42),
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
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
        allowNull: true
      },
      verification_status: {
        type: DataTypes.ENUM('unverified', 'pending', 'verified', 'rejected'),
        defaultValue: 'unverified'
      },
      verification_data: {
        type: DataTypes.TEXT,
        allowNull: true
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
        allowNull: true
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

    // Create indexes for Users table
    await queryInterface.addIndex('users', ['wallet_address']);
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['status']);
    await queryInterface.addIndex('users', ['verification_status']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};
