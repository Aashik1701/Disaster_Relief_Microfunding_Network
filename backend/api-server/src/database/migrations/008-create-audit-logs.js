const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Audit Logs table
    await queryInterface.createTable('audit_logs', {
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
      wallet_address: {
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
      resource_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      old_values: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      new_values: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      metadata: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      success: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      error_message: {
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

    // Create indexes for Audit Logs table
    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['wallet_address']);
    await queryInterface.addIndex('audit_logs', ['action']);
    await queryInterface.addIndex('audit_logs', ['resource']);
    await queryInterface.addIndex('audit_logs', ['resource_id']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
    await queryInterface.addIndex('audit_logs', ['success']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('audit_logs');
  }
};
