const { SystemSettings } = require('../../models');

module.exports = {
  up: async () => {
    try {
      const defaultSettings = [
        // App Configuration
        {
          key: 'app.name',
          value: 'Avalanche Disaster Relief Network',
          type: 'string',
          description: 'Application name',
          category: 'app'
        },
        {
          key: 'app.version',
          value: '2.0.0',
          type: 'string',
          description: 'Application version',
          category: 'app'
        },
        {
          key: 'app.maintenance_mode',
          value: 'false',
          type: 'boolean',
          description: 'Enable maintenance mode',
          category: 'app'
        },
        
        // Blockchain Configuration
        {
          key: 'blockchain.network',
          value: 'fuji',
          type: 'string',
          description: 'Blockchain network (fuji/mainnet)',
          category: 'blockchain'
        },
        {
          key: 'blockchain.contract_address',
          value: '0x6a66fE30D16eceF92752A6C005f474b6125f847D',
          type: 'string',
          description: 'Main contract address',
          category: 'blockchain'
        },
        {
          key: 'blockchain.gas_limit',
          value: '8000000',
          type: 'string',
          description: 'Default gas limit for transactions',
          category: 'blockchain'
        },
        {
          key: 'blockchain.gas_price',
          value: '25000000000',
          type: 'string',
          description: 'Default gas price in wei',
          category: 'blockchain'
        },
        
        // Security Settings
        {
          key: 'security.max_login_attempts',
          value: '5',
          type: 'number',
          description: 'Maximum login attempts before lockout',
          category: 'security'
        },
        {
          key: 'security.lockout_duration',
          value: '900',
          type: 'number',
          description: 'Lockout duration in seconds (15 minutes)',
          category: 'security'
        },
        {
          key: 'security.jwt_expiry',
          value: '3600',
          type: 'number',
          description: 'JWT token expiry in seconds (1 hour)',
          category: 'security'
        },
        {
          key: 'security.session_timeout',
          value: '7200',
          type: 'number',
          description: 'Session timeout in seconds (2 hours)',
          category: 'security'
        },
        
        // File Upload Settings
        {
          key: 'upload.max_file_size',
          value: '10485760',
          type: 'number',
          description: 'Maximum file size in bytes (10MB)',
          category: 'upload'
        },
        {
          key: 'upload.allowed_types',
          value: JSON.stringify(['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']),
          type: 'array',
          description: 'Allowed MIME types for file uploads',
          category: 'upload'
        },
        
        // Notification Settings
        {
          key: 'notifications.email_enabled',
          value: 'true',
          type: 'boolean',
          description: 'Enable email notifications',
          category: 'notifications'
        },
        {
          key: 'notifications.sms_enabled',
          value: 'true',
          type: 'boolean',
          description: 'Enable SMS notifications',
          category: 'notifications'
        },
        {
          key: 'notifications.from_email',
          value: 'noreply@disasterrelief.network',
          type: 'string',
          description: 'From email address for notifications',
          category: 'notifications'
        },
        
        // Cache Settings
        {
          key: 'cache.default_ttl',
          value: '3600',
          type: 'number',
          description: 'Default cache TTL in seconds (1 hour)',
          category: 'cache'
        },
        {
          key: 'cache.analytics_ttl',
          value: '300',
          type: 'number',
          description: 'Analytics cache TTL in seconds (5 minutes)',
          category: 'cache'
        },
        
        // API Rate Limiting
        {
          key: 'rate_limit.window_ms',
          value: '900000',
          type: 'number',
          description: 'Rate limit window in milliseconds (15 minutes)',
          category: 'rate_limit'
        },
        {
          key: 'rate_limit.max_requests',
          value: '100',
          type: 'number',
          description: 'Maximum requests per window',
          category: 'rate_limit'
        },
        
        // Disaster Management
        {
          key: 'disaster.auto_activate_threshold',
          value: '1000',
          type: 'number',
          description: 'Minimum funding in USDC to auto-activate disaster zone',
          category: 'disaster'
        },
        {
          key: 'disaster.voucher_expiry_days',
          value: '30',
          type: 'number',
          description: 'Default voucher expiry in days',
          category: 'disaster'
        },
        {
          key: 'disaster.max_voucher_amount',
          value: '500',
          type: 'number',
          description: 'Maximum voucher amount in USDC',
          category: 'disaster'
        },
        
        // Analytics
        {
          key: 'analytics.enabled',
          value: 'true',
          type: 'boolean',
          description: 'Enable analytics tracking',
          category: 'analytics'
        },
        {
          key: 'analytics.retention_days',
          value: '365',
          type: 'number',
          description: 'Data retention period in days',
          category: 'analytics'
        }
      ];

      for (const setting of defaultSettings) {
        await SystemSettings.findOrCreate({
          where: { key: setting.key },
          defaults: setting
        });
      }

      console.log('✅ System settings seeded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error seeding system settings:', error);
      return false;
    }
  },

  down: async () => {
    try {
      const settingKeys = [
        'app.name', 'app.version', 'app.maintenance_mode',
        'blockchain.network', 'blockchain.contract_address', 'blockchain.gas_limit', 'blockchain.gas_price',
        'security.max_login_attempts', 'security.lockout_duration', 'security.jwt_expiry', 'security.session_timeout',
        'upload.max_file_size', 'upload.allowed_types',
        'notifications.email_enabled', 'notifications.sms_enabled', 'notifications.from_email',
        'cache.default_ttl', 'cache.analytics_ttl',
        'rate_limit.window_ms', 'rate_limit.max_requests',
        'disaster.auto_activate_threshold', 'disaster.voucher_expiry_days', 'disaster.max_voucher_amount',
        'analytics.enabled', 'analytics.retention_days'
      ];

      await SystemSettings.destroy({
        where: { key: settingKeys }
      });

      console.log('✅ System settings removed successfully');
      return true;
    } catch (error) {
      console.error('❌ Error removing system settings:', error);
      return false;
    }
  }
};
