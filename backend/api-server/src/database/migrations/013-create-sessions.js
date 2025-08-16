const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Sessions table for user session management
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        comment: 'Session UUID'
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
      wallet_address: {
        type: DataTypes.STRING(42),
        allowNull: false
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true
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
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Serialized session data'
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

    // Create indexes for Sessions table
    await queryInterface.addIndex('sessions', ['user_id']);
    await queryInterface.addIndex('sessions', ['wallet_address']);
    await queryInterface.addIndex('sessions', ['is_active']);
    await queryInterface.addIndex('sessions', ['expires_at']);
    await queryInterface.addIndex('sessions', ['last_activity']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sessions');
  }
};
