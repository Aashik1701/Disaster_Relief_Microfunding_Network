const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Proof of Aid table
    await queryInterface.createTable('proof_of_aids', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'transactions',
          key: 'id'
        }
      },
      ipfs_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      verification_status: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending'
      },
      verifiedBy: {
        type: DataTypes.STRING(42),
        allowNull: true
      },
      verificationDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      metadata: {
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

    // Create indexes for Proof of Aid table
    await queryInterface.addIndex('proof_of_aids', ['transaction_id']);
    await queryInterface.addIndex('proof_of_aids', ['ipfs_hash']);
    await queryInterface.addIndex('proof_of_aids', ['verification_status']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('proof_of_aids');
  }
};
