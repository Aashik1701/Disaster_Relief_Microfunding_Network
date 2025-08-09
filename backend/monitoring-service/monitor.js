require('dotenv').config();
const ContractEventListener = require('./src/listeners/contractEventListener');
const TransactionListener = require('./src/listeners/transactionListener');
const AlertListener = require('./src/listeners/alertListener');
const logger = require('./src/utils/logger');

class MonitoringService {
  constructor() {
    this.listeners = [];
    this.isRunning = false;
  }

  async start() {
    try {
      logger.info('🚀 Starting monitoring service...');
      
      // Initialize listeners
      const contractListener = new ContractEventListener();
      const transactionListener = new TransactionListener();
      const alertListener = new AlertListener();
      
      this.listeners = [contractListener, transactionListener, alertListener];
      
      // Start all listeners
      for (const listener of this.listeners) {
        await listener.start();
      }
      
      this.isRunning = true;
      logger.info('✅ Monitoring service started successfully');
      
      // Handle graceful shutdown
      process.on('SIGINT', this.gracefulShutdown.bind(this));
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      
    } catch (error) {
      logger.error('❌ Failed to start monitoring service:', error);
      process.exit(1);
    }
  }

  async gracefulShutdown() {
    logger.info('🛑 Shutting down monitoring service...');
    
    // Stop all listeners
    for (const listener of this.listeners) {
      await listener.stop();
    }
    
    this.isRunning = false;
    logger.info('✅ Monitoring service stopped');
    process.exit(0);
  }
}

// Start the monitoring service
const monitoringService = new MonitoringService();
monitoringService.start();