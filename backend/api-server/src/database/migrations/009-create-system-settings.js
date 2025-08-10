const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create System Settings table
    await queryInterface.createTable('system_settings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      key: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array'),
        defaultValue: 'string'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      category: {
        type: DataTypes.STRING(50),
        defaultValue: 'general'
      },
      is_read_only: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      last_modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
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

    // Create indexes for System Settings table
    await queryInterface.addIndex('system_settings', ['key']);
    await queryInterface.addIndex('system_settings', ['category']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('system_settings');
  }
};
