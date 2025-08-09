// App constants
module.exports = {
  // User roles
  ROLES: {
    ADMIN: 'admin',
    VENDOR: 'vendor',
    USER: 'user'
  },
  
  // Disaster statuses
  DISASTER_STATUSES: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    COMPLETED: 'completed'
  },
  
  // Transaction statuses
  TRANSACTION_STATUSES: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    FAILED: 'failed'
  },
  
  // Cache expiration times (in seconds)
  CACHE_EXPIRATION: {
    SHORT: 300,    // 5 minutes
    MEDIUM: 600,   // 10 minutes
    LONG: 3600     // 1 hour
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },
  
  // File upload limits
  UPLOAD_LIMITS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime']
  },
  
  // Blockchain settings
  BLOCKCHAIN: {
    CONFIRMATIONS: 6,
    GAS_LIMIT: 300000,
    GAS_PRICE_GWEI: 30
  }
};