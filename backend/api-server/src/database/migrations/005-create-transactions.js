const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Transactions table
    await queryInterface.createTable('transactions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tx_hash: {
        type: DataTypes.STRING(66),
        unique: true,
        allowNull: false
      },
      voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'vouchers',
          key: 'id'
        }
      },
      vendor_address: {
        type: DataTypes.STRING(42),
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
      beneficiary: {
        type: DataTypes.STRING(42),
        allowNull: true
      },
      amount: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ipfsProofHash: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
      },
      block_number: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'confirmed'
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

    // Create indexes for Transactions table
    await queryInterface.addIndex('transactions', ['tx_hash']);
    await queryInterface.addIndex('transactions', ['voucher_id']);
    await queryInterface.addIndex('transactions', ['vendor_address']);
    await queryInterface.addIndex('transactions', ['user_id']);
    await queryInterface.addIndex('transactions', ['timestamp']);
    await queryInterface.addIndex('transactions', ['status']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('transactions');
  }
};
