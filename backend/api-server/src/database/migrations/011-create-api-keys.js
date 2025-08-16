const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create API Keys table for managing third-party integrations
    await queryInterface.createTable('api_keys', {
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
        },
        onDelete: 'SET NULL'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Human readable name for the API key'
      },
      key_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Hashed API key for security'
      },
      prefix: {
        type: DataTypes.STRING(8),
        allowNull: false,
        comment: 'First 8 characters of the key for identification'
      },
      permissions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of permissions granted to this API key'
      },
      rate_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 1000,
        comment: 'Requests per hour limit'
      },
      last_used: {
        type: DataTypes.DATE,
        allowNull: true
      },
      usage_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
        comment: 'Array of whitelisted IP addresses'
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

    // Create indexes for API Keys table
    await queryInterface.addIndex('api_keys', ['key_hash']);
    await queryInterface.addIndex('api_keys', ['user_id']);
    await queryInterface.addIndex('api_keys', ['is_active']);
    await queryInterface.addIndex('api_keys', ['expires_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('api_keys');
  }
};
