const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Analytics Cache table
    await queryInterface.createTable('analytics_caches', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      key: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(50),
        defaultValue: 'general'
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

    // Create indexes for Analytics Cache table
    await queryInterface.addIndex('analytics_caches', ['key']);
    await queryInterface.addIndex('analytics_caches', ['expires_at']);
    await queryInterface.addIndex('analytics_caches', ['category']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('analytics_caches');
  }
};
