#!/usr/bin/env node

/**
 * Database CLI Tool for Disaster Relief Network
 * 
 * Usage:
 *   node db-cli.js [command] [options]
 * 
 * Commands:
 *   init       - Initialize database (run migrations and seeders)
 *   migrate    - Run pending migrations
 *   rollback   - Rollback last migration
 *   seed       - Run all seeders
 *   reset      - Reset database (DROP ALL TABLES and recreate)
 *   status     - Show database status
 *   health     - Database health check
 */

const path = require('path');
const { sequelize } = require('./connection');
const DatabaseManager = require('./manager');

class DatabaseCLI {
  constructor() {
    this.dbManager = new DatabaseManager();
  }

  async init() {
    console.log('🚀 Initializing database...\n');
    try {
      const success = await this.dbManager.initializeDatabase();
      if (success) {
        console.log('\n✅ Database initialization completed successfully!');
        process.exit(0);
      } else {
        console.log('\n❌ Database initialization failed!');
        process.exit(1);
      }
    } catch (error) {
      console.error('\n❌ Error during initialization:', error.message);
      process.exit(1);
    }
  }

  async migrate() {
    console.log('🔄 Running migrations...\n');
    try {
      await this.dbManager.runMigrations();
      console.log('\n✅ Migrations completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Migration failed:', error.message);
      process.exit(1);
    }
  }

  async rollback() {
    console.log('⏪ Rolling back migration...\n');
    try {
      await this.dbManager.rollbackMigration();
      console.log('\n✅ Rollback completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Rollback failed:', error.message);
      process.exit(1);
    }
  }

  async seed() {
    console.log('🌱 Running seeders...\n');
    try {
      await this.dbManager.runSeeders();
      console.log('\n✅ Seeding completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Seeding failed:', error.message);
      process.exit(1);
    }
  }

  async reset() {
    console.log('⚠️  WARNING: This will DELETE ALL DATA in the database!');
    console.log('🔄 Resetting database...\n');
    
    try {
      await this.dbManager.resetDatabase();
      console.log('\n✅ Database reset completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Database reset failed:', error.message);
      process.exit(1);
    }
  }

  async status() {
    console.log('📊 Checking database status...\n');
    try {
      const status = await this.dbManager.getStatus();
      
      if (status.connected) {
        console.log('✅ Database Connection: Connected');
        console.log(`📦 Database: ${status.database}`);
        console.log(`🔧 Dialect: ${status.dialect}`);
        console.log('\n📋 Migrations:');
        console.log(`   Total: ${status.migrations.total}`);
        console.log(`   Executed: ${status.migrations.executed}`);
        console.log(`   Pending: ${status.migrations.pending}`);
        
        if (status.migrations.pendingFiles.length > 0) {
          console.log('\n⏳ Pending migrations:');
          status.migrations.pendingFiles.forEach(file => {
            console.log(`   - ${file}`);
          });
        }
        
        console.log(`\n🌱 Seeders: ${status.seeders.total} available`);
      } else {
        console.log('❌ Database Connection: Failed');
        console.log(`   Error: ${status.error}`);
      }
      
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Status check failed:', error.message);
      process.exit(1);
    }
  }

  async health() {
    console.log('🏥 Performing health check...\n');
    try {
      const health = await this.dbManager.healthCheck();
      
      if (health.status === 'healthy') {
        console.log('✅ Database Status: Healthy');
        console.log(`🕐 Timestamp: ${health.timestamp}`);
        console.log(`🔧 Dialect: ${health.dialect}`);
        console.log(`📦 Database: ${health.database}`);
      } else {
        console.log('❌ Database Status: Unhealthy');
        console.log(`🕐 Timestamp: ${health.timestamp}`);
        console.log(`❌ Error: ${health.error}`);
      }
      
      process.exit(health.status === 'healthy' ? 0 : 1);
    } catch (error) {
      console.error('\n❌ Health check failed:', error.message);
      process.exit(1);
    }
  }

  async tables() {
    console.log('📋 Checking database tables...\n');
    try {
      // Get all table names from the database
      const [results] = await sequelize.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
      );
      
      console.log(`✅ Found ${results.length} tables:`);
      results.forEach(row => {
        console.log(`   - ${row.name}`);
      });
      
      console.log('\n');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error listing tables:', error.message);
      process.exit(1);
    }
  }

  showHelp() {
    console.log(`
🗄️  Database CLI Tool for Disaster Relief Network

USAGE:
  node db-cli.js <command>

COMMANDS:
  init       Initialize database (run migrations and seeders)
  migrate    Run pending migrations only
  rollback   Rollback the last migration
  seed       Run all seeders only
  reset      ⚠️  Reset database (DROP ALL TABLES and recreate)
  status     Show current database status
  health     Perform database health check
  help       Show this help message

EXAMPLES:
  node db-cli.js init       # First-time setup
  node db-cli.js migrate    # Update database schema
  node db-cli.js seed       # Populate with sample data
  node db-cli.js status     # Check what needs to be done
  node db-cli.js health     # Test database connection

ENVIRONMENT:
  Set SEED_DATABASE=true to force seeding in production
  Set NODE_ENV=development for development features
    `);
  }

  async run() {
    const command = process.argv[2];

    switch (command) {
      case 'init':
        await this.init();
        break;
      case 'migrate':
        await this.migrate();
        break;
      case 'rollback':
        await this.rollback();
        break;
      case 'seed':
        await this.seed();
        break;
      case 'reset':
        await this.reset();
        break;
      case 'status':
        await this.status();
        break;
      case 'tables':
        await this.tables();
        break;
      case 'health':
        await this.health();
        break;
      case 'help':
      case '--help':
      case '-h':
        this.showHelp();
        process.exit(0);
        break;
      default:
        console.log('❌ Unknown command:', command);
        this.showHelp();
        process.exit(1);
    }
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  const cli = new DatabaseCLI();
  cli.run().catch(error => {
    console.error('❌ CLI Error:', error);
    process.exit(1);
  });
}

module.exports = DatabaseCLI;
