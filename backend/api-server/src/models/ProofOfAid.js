const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const ProofOfAid = sequelize.define('proof_of_aid', {
  proofId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ipfsHash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fileType: DataTypes.STRING(50),
  fileSize: DataTypes.INTEGER,
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = ProofOfAid;