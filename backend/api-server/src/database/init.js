const { sequelize } = require('./connection');
const DatabaseManager = require('./manager');
const { 
  User, 
  Disaster, 
  Vendor, 
  Voucher, 
  Transaction, 
  ProofOfAid, 
  AnalyticsCache,
  AuditLog,
  SystemSettings 
} = require('../models');

async function initializeDatabase() {
  const dbManager = new DatabaseManager();
  
  try {
    console.log('🔄 Starting database initialization...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Check if we need to run migrations
    const status = await dbManager.getStatus();
    console.log('📊 Database status:', status);
    
    if (status.migrations.pending > 0) {
      console.log(`🔄 Running ${status.migrations.pending} pending migrations...`);
      await dbManager.runMigrations();
    } else {
      console.log('✅ All migrations up to date');
    }
    
    // Alternative: Use Sequelize sync for development
    // Disabled because we're using migrations for schema management
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('🔄 Syncing models in development mode...');
    //   await sequelize.sync({ alter: true });
    //   console.log('✅ Database models synchronized successfully.');
    // }
    
    // Create indexes for performance (skip for SQLite in-memory development)
    if (sequelize.getDialect() !== 'sqlite') {
      console.log('🔄 Creating database indexes...');
      try {
        await sequelize.query(`
          CREATE INDEX IF NOT EXISTS idx_disaster_status ON disasters(status);
          CREATE INDEX IF NOT EXISTS idx_disaster_created_at ON disasters(created_at);
          CREATE INDEX IF NOT EXISTS idx_vendor_disaster_zone ON vendors(disaster_zone_id);
          CREATE INDEX IF NOT EXISTS idx_transaction_timestamp ON transactions(timestamp);
          CREATE INDEX IF NOT EXISTS idx_transaction_voucher ON transactions(voucher_id);
          CREATE INDEX IF NOT EXISTS idx_proof_of_aid_ipfs ON proof_of_aids(ipfs_hash);
          CREATE INDEX IF NOT EXISTS idx_user_wallet ON users(wallet_address);
          CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);
          CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_logs(user_id);
          CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_logs(action);
        `);
        console.log('✅ Database indexes created successfully.');
      } catch (indexError) {
        console.warn('⚠️ Some indexes may already exist:', indexError.message);
      }
    } else {
      console.log('✅ SQLite in-memory database initialized (indexes skipped).');
    }
    
    // Run seeders if in development or if database is empty
    if (process.env.NODE_ENV === 'development' || process.env.SEED_DATABASE === 'true') {
      console.log('🔄 Checking if database needs seeding...');
      
      const userCount = await User.count();
      if (userCount === 0) {
        console.log('🔄 Database appears empty, running seeders...');
        await dbManager.runSeeders();
      } else {
        console.log(`✅ Database has ${userCount} users, skipping seeders`);
      }
    }
    
    // Final health check
    const healthCheck = await dbManager.healthCheck();
    console.log('🏥 Database health check:', healthCheck);
    
    if (healthCheck.status === 'healthy') {
      console.log('✅ Database initialization completed successfully');
      return true;
    } else {
      console.error('❌ Database health check failed');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    
    // If it's a connection error, provide helpful guidance
    if (error.name === 'SequelizeConnectionError') {
      console.error('\n📋 Database Connection Troubleshooting:');
      console.error('1. Check if your DATABASE_URL is correct in .env file');
      console.error('2. Ensure the database server is running');
      console.error('3. Verify network connectivity to the database');
      console.error('4. Check if credentials are valid');
    }
    
    return false;
  }
}

// Export both the function and manager for CLI usage
module.exports = initializeDatabase;
module.exports.DatabaseManager = DatabaseManager;