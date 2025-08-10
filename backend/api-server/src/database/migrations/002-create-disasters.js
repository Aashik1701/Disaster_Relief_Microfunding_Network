const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Disasters table
    await queryInterface.createTable('disasters', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      zone_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8), 
        allowNull: false
      },
      radius: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      initial_funding: {
        type: DataTypes.DECIMAL(20, 6),
        defaultValue: 0
      },
      current_funding: {
        type: DataTypes.DECIMAL(20, 6),
        defaultValue: 0
      },
      total_spent: {
        type: DataTypes.DECIMAL(20, 6),
        defaultValue: 0
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'active'
      },
      tx_hash: {
        type: DataTypes.STRING(66),
        allowNull: true
      },
      created_by: {
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

    // Create indexes for Disasters table
    await queryInterface.addIndex('disasters', ['zone_id']);
    await queryInterface.addIndex('disasters', ['status']);
    await queryInterface.addIndex('disasters', ['created_by']);
    await queryInterface.addIndex('disasters', ['created_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('disasters');
  }
};
