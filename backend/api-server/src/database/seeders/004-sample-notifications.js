const { Notification } = require('../../models');

module.exports = {
  up: async () => {
    try {
      console.log('🔄 Creating sample notifications...');
      
      const sampleNotifications = [
        {
          user_id: 1, // Admin user
          type: 'system_update',
          title: 'System Maintenance Scheduled',
          message: 'System maintenance is scheduled for tonight at 2:00 AM UTC. Expected downtime: 30 minutes.',
          priority: 'medium',
          data: {
            maintenance_window: '2025-08-17T02:00:00Z',
            duration: 30,
            affected_services: ['API', 'Dashboard']
          },
          action_url: '/admin/maintenance',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          sent_via: ['email', 'push']
        },
        {
          user_id: 1,
          type: 'emergency',
          title: 'Critical Alert: High Transaction Volume',
          message: 'Unusual high transaction volume detected. Please review system performance.',
          priority: 'critical',
          data: {
            transaction_count: 15000,
            threshold: 10000,
            time_window: '1 hour'
          },
          action_url: '/admin/analytics/transactions',
          sent_via: ['email', 'sms', 'push']
        },
        {
          user_id: 2, // Donor user
          type: 'payment_sent',
          title: 'Donation Successful',
          message: 'Your donation of $500 has been successfully sent to Hurricane Relief Fund.',
          priority: 'low',
          data: {
            amount: 500,
            currency: 'USDC',
            disaster: 'Hurricane Relief 2025',
            transaction_hash: '0x1234567890abcdef'
          },
          action_url: '/donor/transactions',
          sent_via: ['email']
        },
        {
          user_id: 3, // Victim user
          type: 'voucher_received',
          title: 'Relief Voucher Issued',
          message: 'You have received a $200 relief voucher. You can use it at approved vendors in your area.',
          priority: 'high',
          data: {
            voucher_amount: 200,
            currency: 'USDC',
            voucher_id: 'VCH001',
            expiry_date: '2025-09-15'
          },
          action_url: '/victim/vouchers',
          expires_at: new Date('2025-09-15'),
          sent_via: ['sms', 'push']
        },
        {
          user_id: 4, // Vendor user
          type: 'vendor_approved',
          title: 'Vendor Application Approved',
          message: 'Congratulations! Your vendor application has been approved. You can now accept relief vouchers.',
          priority: 'high',
          data: {
            vendor_id: 'VND001',
            approval_date: new Date().toISOString(),
            disaster_zones: ['Zone A', 'Zone B']
          },
          action_url: '/vendor/dashboard',
          sent_via: ['email', 'push']
        },
        {
          user_id: 5, // Government user
          type: 'disaster_alert',
          title: 'New Disaster Zone Declared',
          message: 'Wildfire in Northern California has been declared a disaster zone. Immediate response required.',
          priority: 'critical',
          data: {
            disaster_type: 'wildfire',
            location: 'Northern California',
            severity: 'high',
            estimated_affected: 50000
          },
          action_url: '/government/disasters/new',
          sent_via: ['email', 'sms', 'push']
        }
      ];
      
      // Create notifications
      const createdNotifications = await Notification.bulkCreate(sampleNotifications);
      console.log(`✅ Created ${createdNotifications.length} sample notifications`);
      
      // Log notification summary by type
      const notificationsByType = createdNotifications.reduce((acc, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Notifications by type:', notificationsByType);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to create sample notifications:', error);
      return false;
    }
  },

  down: async () => {
    try {
      console.log('🔄 Removing sample notifications...');
      const deletedCount = await Notification.destroy({
        where: {},
        truncate: true
      });
      console.log(`✅ Removed sample notifications`);
      return true;
    } catch (error) {
      console.error('❌ Failed to remove sample notifications:', error);
      return false;
    }
  }
};
