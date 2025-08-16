const { ApiKey } = require('../../models');

module.exports = {
  up: async () => {
    try {
      console.log('🔄 Creating sample API keys...');
      
      // Create API keys for different use cases
      const apiKeyData = [
        {
          user_id: 1, // Admin user
          name: 'Admin Dashboard API',
          permissions: ['*'], // Full access
          rate_limit: 5000,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          ip_whitelist: ['127.0.0.1', '192.168.1.0/24']
        },
        {
          user_id: 2, // Donor user
          name: 'Donor Mobile App',
          permissions: ['donations.read', 'donations.create', 'transactions.read', 'profile.read'],
          rate_limit: 1000,
          expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 months
        },
        {
          user_id: 4, // Vendor user
          name: 'Vendor POS System',
          permissions: ['vouchers.read', 'vouchers.redeem', 'transactions.create', 'profile.read'],
          rate_limit: 2000,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 months
        },
        {
          user_id: null, // System integration
          name: 'External Analytics Service',
          permissions: ['analytics.read', 'reports.read'],
          rate_limit: 500,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
          ip_whitelist: ['203.0.113.0/24'] // Specific external IPs
        },
        {
          user_id: 5, // Government user
          name: 'Government Reporting API',
          permissions: ['disasters.read', 'analytics.read', 'reports.create', 'vouchers.read'],
          rate_limit: 2000,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        }
      ];
      
      const createdApiKeys = [];
      
      for (const data of apiKeyData) {
        const { apiKey, plainKey } = await ApiKey.createApiKey(data);
        createdApiKeys.push({
          ...apiKey.toJSON(),
          plainKey // Include for seeding purposes only
        });
        
        console.log(`✅ Created API key: ${data.name}`);
        console.log(`   Key: ${plainKey.substring(0, 20)}...`);
        console.log(`   Permissions: ${data.permissions.join(', ')}`);
      }
      
      console.log(`✅ Created ${createdApiKeys.length} sample API keys`);
      
      // Log API keys summary
      const keysByUser = createdApiKeys.reduce((acc, key) => {
        const userId = key.user_id || 'system';
        acc[userId] = (acc[userId] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 API keys by user:', keysByUser);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to create sample API keys:', error);
      return false;
    }
  },

  down: async () => {
    try {
      console.log('🔄 Removing sample API keys...');
      const deletedCount = await ApiKey.destroy({
        where: {},
        truncate: true
      });
      console.log(`✅ Removed sample API keys`);
      return true;
    } catch (error) {
      console.error('❌ Failed to remove sample API keys:', error);
      return false;
    }
  }
};
