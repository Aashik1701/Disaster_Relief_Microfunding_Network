const { sequelize } = require('./connection');
const { Disaster, Vendor, Voucher, Transaction, ProofOfAid, AnalyticsCache } = require('../models');

async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized successfully.');
    
    // Create indexes for performance
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_disasters_status ON disasters(status);
      CREATE INDEX IF NOT EXISTS idx_disasters_created_at ON disasters(created_at);
      CREATE INDEX IF NOT EXISTS idx_vendors_disaster_zone ON vendors(disaster_zone_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
      CREATE INDEX IF NOT EXISTS idx_transactions_voucher ON transactions(voucher_id);
      CREATE INDEX IF NOT EXISTS idx_proof_ipfs ON proof_of_aids(ipfs_hash);
    `);
    
    console.log('✅ Database indexes created successfully.');
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

module.exports = initializeDatabase;