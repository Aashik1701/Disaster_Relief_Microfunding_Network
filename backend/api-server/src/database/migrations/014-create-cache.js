const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Create Cache table for application-level caching
    await queryInterface.createTable('cache', {
      key: {
        type: DataTypes.STRING,
        primaryKey: true,
        comment: 'Cache key'
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Cached value (JSON serialized)'
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of tags for cache invalidation'
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When the cache entry expires'
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

    // Create indexes for Cache table
    await queryInterface.addIndex('cache', ['expires_at']);
    await queryInterface.addIndex('cache', ['created_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('cache');
  }
};
