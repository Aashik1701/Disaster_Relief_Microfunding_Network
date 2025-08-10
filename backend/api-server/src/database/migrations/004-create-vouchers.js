const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Vouchers table
    await queryInterface.createTable('vouchers', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      voucher_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
      },
      beneficiary: {
        type: DataTypes.STRING(42),
        allowNull: false
      },
      recipient_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      disaster_zone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'disasters',
          key: 'id'
        }
      },
      amount: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false
      },
      expiry_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      allowedCategories: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tx_hash: {
        type: DataTypes.STRING(66),
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

    // Create indexes for Vouchers table
    await queryInterface.addIndex('vouchers', ['voucher_id']);
    await queryInterface.addIndex('vouchers', ['beneficiary']);
    await queryInterface.addIndex('vouchers', ['recipient_id']);
    await queryInterface.addIndex('vouchers', ['disaster_zone_id']);
    await queryInterface.addIndex('vouchers', ['used']);
    await queryInterface.addIndex('vouchers', ['expiry_time']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('vouchers');
  }
};
