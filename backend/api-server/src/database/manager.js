const fs = require('fs');
const path = require('path');
const { sequelize } = require('./connection');
const { QueryInterface } = require('sequelize');

class DatabaseManager {
  constructor() {
    this.migrationsPath = path.join(__dirname, 'migrations');
    this.seedersPath = path.join(__dirname, 'seeders');
    this.queryInterface = sequelize.getQueryInterface();
  }

  // Create metadata table to track migrations
  async createMetadataTable() {
    try {
      await this.queryInterface.createTable('sequelize_meta', {
        name: {
          type: sequelize.Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        }
      });
    } catch (error) {
      // Table might already exist, ignore error
    }
  }

  // Get list of executed migrations
  async getExecutedMigrations() {
    try {
      const results = await sequelize.query(
        'SELECT name FROM sequelize_meta ORDER BY name',
        { type: sequelize.QueryTypes.SELECT }
      );
      return results.map(r => r.name);
    } catch (error) {
      return [];
    }
  }

  // Mark migration as executed
  async markMigrationExecuted(migrationName) {
    await sequelize.query(
      'INSERT INTO sequelize_meta (name) VALUES (?)',
      { replacements: [migrationName] }
    );
  }

  // Mark migration as not executed
  async markMigrationNotExecuted(migrationName) {
    await sequelize.query(
      'DELETE FROM sequelize_meta WHERE name = ?',
      { replacements: [migrationName] }
    );
  }

  // Get all migration files
  getMigrationFiles() {
    if (!fs.existsSync(this.migrationsPath)) {
      return [];
    }
    
    return fs.readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.js'))
      .sort();
  }

  // Get all seeder files
  getSeederFiles() {
    if (!fs.existsSync(this.seedersPath)) {
      return [];
    }
    
    return fs.readdirSync(this.seedersPath)
      .filter(file => file.endsWith('.js'))
      .sort();
  }

  // Run pending migrations
  async runMigrations() {
    console.log('🔄 Running database migrations...');
    
    try {
      await this.createMetadataTable();
      
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = this.getMigrationFiles();
      
      console.log(`📁 Found ${migrationFiles.length} migration files`);
      console.log(`✅ ${executedMigrations.length} migrations already executed`);
      
      let executedCount = 0;
      
      for (const migrationFile of migrationFiles) {
        if (!executedMigrations.includes(migrationFile)) {
          console.log(`🔄 Running migration: ${migrationFile}`);
          
          const migrationPath = path.join(this.migrationsPath, migrationFile);
          const migration = require(migrationPath);
          
          await migration.up(this.queryInterface, sequelize.Sequelize);
          await this.markMigrationExecuted(migrationFile);
          
          console.log(`✅ Migration completed: ${migrationFile}`);
          executedCount++;
        }
      }
      
      if (executedCount === 0) {
        console.log('✅ All migrations already executed');
      } else {
        console.log(`✅ Successfully executed ${executedCount} migrations`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  // Rollback last migration
  async rollbackMigration() {
    console.log('🔄 Rolling back last migration...');
    
    try {
      const executedMigrations = await this.getExecutedMigrations();
      
      if (executedMigrations.length === 0) {
        console.log('ℹ️ No migrations to rollback');
        return true;
      }
      
      const lastMigration = executedMigrations[executedMigrations.length - 1];
      console.log(`🔄 Rolling back migration: ${lastMigration}`);
      
      const migrationPath = path.join(this.migrationsPath, lastMigration);
      const migration = require(migrationPath);
      
      await migration.down(this.queryInterface, sequelize.Sequelize);
      await this.markMigrationNotExecuted(lastMigration);
      
      console.log(`✅ Migration rolled back: ${lastMigration}`);
      return true;
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }

  // Run seeders
  async runSeeders() {
    console.log('🔄 Running database seeders...');
    
    try {
      const seederFiles = this.getSeederFiles();
      console.log(`📁 Found ${seederFiles.length} seeder files`);
      
      let executedCount = 0;
      
      for (const seederFile of seederFiles) {
        console.log(`🔄 Running seeder: ${seederFile}`);
        
        const seederPath = path.join(this.seedersPath, seederFile);
        const seeder = require(seederPath);
        
        const result = await seeder.up();
        if (result) {
          console.log(`✅ Seeder completed: ${seederFile}`);
          executedCount++;
        } else {
          console.log(`⚠️ Seeder skipped or failed: ${seederFile}`);
        }
      }
      
      console.log(`✅ Successfully executed ${executedCount} seeders`);
      return true;
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  // Reset database (for development)
  async resetDatabase() {
    console.log('🔄 Resetting database...');
    
    try {
      // Drop all tables
      await sequelize.drop();
      console.log('✅ All tables dropped');
      
      // Run migrations
      await this.runMigrations();
      
      // Run seeders
      await this.runSeeders();
      
      console.log('✅ Database reset completed');
      return true;
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      throw error;
    }
  }

  // Initialize database (first setup)
  async initializeDatabase() {
    console.log('🔄 Initializing database...');
    
    try {
      // Test connection
      await sequelize.authenticate();
      console.log('✅ Database connection established');
      
      // Run migrations
      await this.runMigrations();
      
      // Run seeders
      await this.runSeeders();
      
      console.log('✅ Database initialization completed');
      return true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  // Get database status
  async getStatus() {
    try {
      await sequelize.authenticate();
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = this.getMigrationFiles();
      const seederFiles = this.getSeederFiles();
      
      const pendingMigrations = migrationFiles.filter(
        file => !executedMigrations.includes(file)
      );
      
      return {
        connected: true,
        database: sequelize.config.database || 'SQLite in-memory',
        dialect: sequelize.getDialect(),
        migrations: {
          total: migrationFiles.length,
          executed: executedMigrations.length,
          pending: pendingMigrations.length,
          pendingFiles: pendingMigrations
        },
        seeders: {
          total: seederFiles.length
        }
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  // Health check
  async healthCheck() {
    try {
      await sequelize.authenticate();
      
      // Test a simple query
      await sequelize.query('SELECT 1 as test', { 
        type: sequelize.QueryTypes.SELECT 
      });
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        dialect: sequelize.getDialect(),
        database: sequelize.config.database || 'SQLite in-memory'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }
}

module.exports = DatabaseManager;
