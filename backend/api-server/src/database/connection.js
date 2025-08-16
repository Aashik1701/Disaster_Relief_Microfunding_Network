const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Database configuration based on environment
const getDatabaseConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';

  // Base configuration
  const config = {
    logging: isDevelopment ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      paranoid: false, // Set to true if you want soft deletes
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    dialectOptions: {},
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 20,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
      evict: 1000,
      handleDisconnects: true
    },
    retry: {
      match: [
        /ECONNRESET/,
        /ENOTFOUND/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /EAI_AGAIN/
      ],
      max: 3
    },
    transactionType: 'IMMEDIATE',
    benchmark: isDevelopment,
    logQueryParameters: isDevelopment
  };

  if (isProduction) {
    // Production-specific optimizations
    config.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      keepAlive: true,
      statement_timeout: 30000,
      query_timeout: 30000,
      idle_in_transaction_session_timeout: 30000
    };
  }

  return config;
};

// Initialize Sequelize instance
const initializeSequelize = () => {
  const config = getDatabaseConfig();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';

  // For test environment, always use SQLite in memory
  if (isTest) {
    return new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      define: config.define
    });
  }

  // For development, use SQLite if no DATABASE_URL is provided
  if (isDevelopment && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('username:password'))) {
    console.log('🔧 Using SQLite in-memory database for development');
    return new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: config.logging,
      define: config.define
    });
  }

  // Production/staging PostgreSQL configuration
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required for production');
  }

  console.log('🐘 Using PostgreSQL database');
  return new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    ...config
  });
};

// Create Sequelize instance
sequelize = initializeSequelize();

// Connection event handlers
sequelize.addHook('beforeConnect', (config) => {
  console.log('🔄 Attempting database connection...');
});

sequelize.addHook('afterConnect', (connection, config) => {
  console.log('✅ Database connection established successfully');
});

sequelize.addHook('beforeDisconnect', (connection) => {
  console.log('🔌 Disconnecting from database...');
});

// Enhanced connection test function
const testConnection = async () => {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test authentication
    await sequelize.authenticate();
    
    // Get connection info
    const dialect = sequelize.getDialect();
    const database = sequelize.config.database || 'SQLite in-memory';
    const host = sequelize.config.host || 'local';
    const port = sequelize.config.port || 'default';
    
    console.log('✅ Database connection test successful:');
    console.log(`   Dialect: ${dialect}`);
    console.log(`   Database: ${database}`);
    console.log(`   Host: ${host}:${port}`);
    
    // Test a simple query
    const result = await sequelize.query('SELECT 1 as test', { 
      type: Sequelize.QueryTypes.SELECT 
    });
    
    if (result && result[0] && result[0].test === 1) {
      console.log('✅ Database query test successful');
    }
    
    // Log connection pool status
    if (sequelize.connectionManager && sequelize.connectionManager.pool) {
      const pool = sequelize.connectionManager.pool;
      console.log(`📊 Connection pool status:`);
      console.log(`   Size: ${pool.size}`);
      console.log(`   Available: ${pool.available}`);
      console.log(`   Using: ${pool.using}`);
      console.log(`   Waiting: ${pool.waiting}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:');
    console.error(`   Error: ${error.message}`);
    
    // Provide specific error guidance
    if (error.name === 'SequelizeConnectionError') {
      console.error('\n📋 Connection troubleshooting:');
      console.error('   1. Check if DATABASE_URL is correct');
      console.error('   2. Verify database server is running');
      console.error('   3. Check network connectivity');
      console.error('   4. Validate credentials');
      console.error('   5. Ensure database exists');
    }
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    return false;
  }
};

// Graceful shutdown handler
const closeConnection = async () => {
  try {
    console.log('🔌 Closing database connection...');
    await sequelize.close();
    console.log('✅ Database connection closed successfully');
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

// Handle application termination
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('💥 Uncaught Exception:', error);
  await closeConnection();
  process.exit(1);
});

// Connection monitoring
let connectionCheckInterval;
const startConnectionMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    connectionCheckInterval = setInterval(async () => {
      try {
        await sequelize.query('SELECT 1', { type: Sequelize.QueryTypes.SELECT });
      } catch (error) {
        console.error('⚠️  Database connection check failed:', error.message);
      }
    }, 60000); // Check every minute
  }
};

const stopConnectionMonitoring = () => {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval);
  }
};

// Database health check function
const healthCheck = async () => {
  try {
    const startTime = Date.now();
    await sequelize.query('SELECT 1 as health_check', { 
      type: Sequelize.QueryTypes.SELECT 
    });
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      dialect: sequelize.getDialect(),
      database: sequelize.config.database || 'SQLite',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Get database statistics
const getDatabaseStats = async () => {
  try {
    const stats = {
      dialect: sequelize.getDialect(),
      database: sequelize.config.database || 'SQLite',
      connectionPool: null,
      activeConnections: 0,
      version: null
    };
    
    // Get database version
    try {
      const versionResult = await sequelize.query('SELECT version()', { 
        type: Sequelize.QueryTypes.SELECT 
      });
      stats.version = versionResult[0]?.version || 'Unknown';
    } catch (error) {
      stats.version = 'Unable to determine';
    }
    
    // Get connection pool stats if available
    if (sequelize.connectionManager && sequelize.connectionManager.pool) {
      const pool = sequelize.connectionManager.pool;
      stats.connectionPool = {
        size: pool.size,
        available: pool.available,
        using: pool.using,
        waiting: pool.waiting,
        maxConnections: pool.max,
        minConnections: pool.min
      };
    }
    
    return stats;
  } catch (error) {
    return {
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  sequelize,
  testConnection,
  closeConnection,
  startConnectionMonitoring,
  stopConnectionMonitoring,
  healthCheck,
  getDatabaseStats,
  Sequelize
};