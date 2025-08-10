#!/usr/bin/env node

/**
 * Database Setup Script for Disaster Relief Network
 * 
 * This script provides a complete database setup workflow with error handling
 * and progress tracking. It can be run in interactive or automated mode.
 * 
 * Usage:
 *   npm run db:setup          # Interactive mode
 *   npm run db:setup -- --auto # Automated mode
 */

require('dotenv').config();
const readline = require('readline');
const { sequelize } = require('./src/database/connection');
const DatabaseManager = require('./src/database/manager');
const initializeDatabase = require('./src/database/init');

class DatabaseSetup {
  constructor() {
    this.dbManager = new DatabaseManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim().toLowerCase());
      });
    });
  }

  async showWelcomeMessage() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    🏥 DISASTER RELIEF DATABASE SETUP                          ║
║                        Avalanche Microfunding Network                        ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Welcome to the Disaster Relief Network database setup wizard!

This wizard will help you:
✅ Test database connectivity
✅ Run database migrations  
✅ Populate initial data
✅ Verify system health

Environment: ${process.env.NODE_ENV || 'development'}
Database: ${process.env.DATABASE_URL ? 'PostgreSQL (Supabase)' : 'SQLite (in-memory)'}
`);
  }

  async checkDatabaseConnection() {
    console.log('🔄 Testing database connection...');
    
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection successful!');
      
      const config = sequelize.config;
      console.log(`   Database: ${config.database || 'SQLite in-memory'}`);
      console.log(`   Dialect: ${sequelize.getDialect()}`);
      console.log(`   Host: ${config.host || 'local'}`);
      
      return true;
    } catch (error) {
      console.log('❌ Database connection failed!');
      console.error('   Error:', error.message);
      
      if (error.name === 'SequelizeConnectionError') {
        console.log('\n📋 Troubleshooting tips:');
        console.log('   1. Check your DATABASE_URL in .env file');
        console.log('   2. Ensure database server is running');
        console.log('   3. Verify network connectivity');
        console.log('   4. Check database credentials');
      }
      
      return false;
    }
  }

  async checkCurrentStatus() {
    console.log('\n🔍 Checking current database status...');
    
    try {
      const status = await this.dbManager.getStatus();
      
      console.log(`📊 Database Status:`);
      console.log(`   Connected: ${status.connected ? '✅' : '❌'}`);
      
      if (status.connected) {
        console.log(`   Database: ${status.database}`);
        console.log(`   Dialect: ${status.dialect}`);
        console.log(`   Migrations: ${status.migrations.executed}/${status.migrations.total} executed`);
        console.log(`   Pending: ${status.migrations.pending} migrations`);
        console.log(`   Seeders: ${status.seeders.total} available`);
        
        if (status.migrations.pending > 0) {
          console.log('\n⏳ Pending migrations:');
          status.migrations.pendingFiles.forEach(file => {
            console.log(`     - ${file}`);
          });
        }
      }
      
      return status;
    } catch (error) {
      console.log('❌ Failed to check database status');
      console.error('   Error:', error.message);
      return null;
    }
  }

  async runSetupInteractive() {
    const status = await this.checkCurrentStatus();
    if (!status || !status.connected) {
      console.log('\n❌ Cannot proceed without database connection');
      return false;
    }
    
    console.log('\n🚀 Ready to proceed with database setup!');
    
    // Ask about migrations
    if (status.migrations.pending > 0) {
      console.log(`\n📋 Found ${status.migrations.pending} pending migrations:`);
      status.migrations.pendingFiles.forEach(file => {
        console.log(`   - ${file}`);
      });
      
      const runMigrations = await this.askQuestion('\nRun pending migrations? (y/n): ');
      
      if (runMigrations === 'y' || runMigrations === 'yes') {
        console.log('\n🔄 Running migrations...');
        try {
          await this.dbManager.runMigrations();
          console.log('✅ Migrations completed successfully!');
        } catch (error) {
          console.log('❌ Migration failed:', error.message);
          return false;
        }
      }
    } else {
      console.log('\n✅ All migrations are up to date');
    }
    
    // Ask about seeders
    const runSeeders = await this.askQuestion('\nPopulate database with sample data? (y/n): ');
    
    if (runSeeders === 'y' || runSeeders === 'yes') {
      console.log('\n🌱 Running seeders...');
      try {
        await this.dbManager.runSeeders();
        console.log('✅ Sample data populated successfully!');
      } catch (error) {
        console.log('❌ Seeding failed:', error.message);
        return false;
      }
    }
    
    return true;
  }

  async runSetupAutomated() {
    console.log('\n🤖 Running automated setup...');
    
    try {
      const success = await initializeDatabase();
      
      if (success) {
        console.log('\n✅ Automated setup completed successfully!');
        return true;
      } else {
        console.log('\n❌ Automated setup failed!');
        return false;
      }
    } catch (error) {
      console.log('\n❌ Automated setup error:', error.message);
      return false;
    }
  }

  async performHealthCheck() {
    console.log('\n🏥 Performing final health check...');
    
    try {
      const health = await this.dbManager.healthCheck();
      
      console.log(`   Status: ${health.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}`);
      console.log(`   Timestamp: ${health.timestamp}`);
      console.log(`   Database: ${health.database || 'SQLite'}`);
      
      if (health.status === 'unhealthy') {
        console.log(`   Error: ${health.error}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return false;
    }
  }

  async showCompletionMessage(success) {
    if (success) {
      console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                            🎉 SETUP COMPLETE!                                 ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Your Disaster Relief Network database is ready! 

🚀 Next steps:
   1. Start the backend server: npm run dev
   2. Start the frontend: cd ../frontend && npm run dev
   3. Deploy smart contracts: cd ../contracts && npm run deploy
   4. Visit the admin dashboard to configure system settings

📚 Useful commands:
   npm run db:status     - Check database status
   npm run db:migrate    - Run migrations only
   npm run db:seed       - Populate sample data
   npm run db:reset      - Reset database (⚠️  destructive)

Happy building! 🏗️
`);
    } else {
      console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                            ❌ SETUP FAILED                                    ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Database setup encountered errors. Please check:

🔍 Troubleshooting:
   1. Database connection settings in .env
   2. Database server availability
   3. Network connectivity
   4. Check logs above for specific errors

📞 Need help?
   - Check the README.md file
   - Review environment setup guide
   - Contact the development team

Retry with: npm run db:setup
`);
    }
  }

  async run() {
    const isAutomated = process.argv.includes('--auto') || process.argv.includes('-a');
    
    try {
      await this.showWelcomeMessage();
      
      // Test database connection
      const connected = await this.checkDatabaseConnection();
      if (!connected) {
        await this.showCompletionMessage(false);
        return;
      }
      
      // Run setup
      let success;
      if (isAutomated) {
        success = await this.runSetupAutomated();
      } else {
        success = await this.runSetupInteractive();
      }
      
      // Health check
      if (success) {
        success = await this.performHealthCheck();
      }
      
      // Show completion message
      await this.showCompletionMessage(success);
      
    } catch (error) {
      console.error('\n💥 Unexpected error during setup:', error);
      await this.showCompletionMessage(false);
    } finally {
      this.rl.close();
      process.exit(0);
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  const setup = new DatabaseSetup();
  setup.run().catch(error => {
    console.error('💥 Setup script error:', error);
    process.exit(1);
  });
}

module.exports = DatabaseSetup;
