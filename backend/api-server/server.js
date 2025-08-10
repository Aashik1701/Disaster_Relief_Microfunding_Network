const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// Import services
const initializeDatabase = require('./src/database/init');
const dataService = require('./src/services/dataService');

const app = express();

const ipfsRoutes = require('./src/routes/ipfs');
app.use('/api/ipfs', ipfsRoutes);

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/disasters', require('./src/routes/disasters'));
app.use('/api/vendors', require('./src/routes/vendors'));
app.use('/api/transactions', require('./src/routes/transactions'));
app.use('/api/ipfs', require('./src/routes/ipfs'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/notifications', require('./src/routes/notifications'));

// Health check
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbHealth = await dataService.healthCheck();
    
    // Check Redis connection
    const cache = require('./src/services/cacheService');
    await cache.client.ping();
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth.status,
      cache: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal Server Error',
      status: error.status || 500
    }
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize database
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      throw new Error('Failed to initialize database');
    }
    
    console.log('✅ Database initialized');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();