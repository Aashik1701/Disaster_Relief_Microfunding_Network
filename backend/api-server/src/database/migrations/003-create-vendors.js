const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Vendors table
    await queryInterface.createTable('vendors', {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
      disaster_zone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'disasters',
          key: 'id'
        }
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      kycIpfsHash: {
        type: DataTypes.STRING,
        allowNull: true
      },
      totalRedeemed: {
        type: DataTypes.DECIMAL(20, 6),
        defaultValue: 0
      },
      transactionCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      reputationScore: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0
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

    // Create indexes for Vendors table
    await queryInterface.addIndex('vendors', ['wallet_address']);
    await queryInterface.addIndex('vendors', ['user_id']);
    await queryInterface.addIndex('vendors', ['disaster_zone_id']);
    await queryInterface.addIndex('vendors', ['verified']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('vendors');
  }
};
