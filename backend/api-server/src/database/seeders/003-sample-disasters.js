const { Disaster, User } = require('../../models');

module.exports = {
  up: async () => {
    try {
      // Find admin user for sample disasters
      const adminUser = await User.findOne({
        where: { role: 'admin' }
      });

      const sampleDisasters = [
        {
          zoneId: 1,
          name: 'Hurricane Relief Zone - Miami',
          latitude: 25.7617,
          longitude: -80.1918,
          radius: 50000, // 50km radius
          initialFunding: 50000.00,
          currentFunding: 45000.00,
          totalSpent: 5000.00,
          status: 'active',
          createdBy: adminUser ? adminUser.id : null,
          txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12'
        },
        {
          zoneId: 2,
          name: 'Earthquake Relief Zone - California',
          latitude: 34.0522,
          longitude: -118.2437,
          radius: 75000, // 75km radius
          initialFunding: 100000.00,
          currentFunding: 87500.00,
          totalSpent: 12500.00,
          status: 'active',
          createdBy: adminUser ? adminUser.id : null,
          txHash: '0x2345678901bcdef12345678901bcdef12345678901bcdef12345678901bcdef123'
        },
        {
          zoneId: 3,
          name: 'Flood Relief Zone - Louisiana',
          latitude: 29.9511,
          longitude: -90.0715,
          radius: 40000, // 40km radius
          initialFunding: 75000.00,
          currentFunding: 60000.00,
          totalSpent: 15000.00,
          status: 'active',
          createdBy: adminUser ? adminUser.id : null,
          txHash: '0x3456789012cdef123456789012cdef123456789012cdef123456789012cdef1234'
        },
        {
          zoneId: 4,
          name: 'Wildfire Relief Zone - Oregon',
          latitude: 44.9429,
          longitude: -123.0351,
          radius: 60000, // 60km radius
          initialFunding: 80000.00,
          currentFunding: 72000.00,
          totalSpent: 8000.00,
          status: 'active',
          createdBy: adminUser ? adminUser.id : null,
          txHash: '0x456789013def123456789013def123456789013def123456789013def12345678'
        },
        {
          zoneId: 5,
          name: 'Tornado Relief Zone - Texas',
          latitude: 32.7767,
          longitude: -96.7970,
          radius: 30000, // 30km radius
          initialFunding: 60000.00,
          currentFunding: 45000.00,
          totalSpent: 15000.00,
          status: 'completed',
          createdBy: adminUser ? adminUser.id : null,
          txHash: '0x56789014ef12345678904ef12345678904ef12345678904ef123456789056789'
        },
        {
          zoneId: 6,
          name: 'Winter Storm Relief Zone - New York',
          latitude: 40.7128,
          longitude: -74.0060,
          radius: 45000, // 45km radius
          initialFunding: 90000.00,
          currentFunding: 85000.00,
          totalSpent: 5000.00,
          status: 'active',
          createdBy: adminUser ? adminUser.id : null,
          txHash: '0x6789015f123456789015f123456789015f123456789015f1234567890156789ab'
        }
      ];

      for (const disasterData of sampleDisasters) {
        await Disaster.findOrCreate({
          where: { zoneId: disasterData.zoneId },
          defaults: disasterData
        });
      }

      console.log('✅ Sample disasters seeded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error seeding disasters:', error);
      return false;
    }
  },

  down: async () => {
    try {
      await Disaster.destroy({
        where: {
          zoneId: [1, 2, 3, 4, 5, 6]
        }
      });
      console.log('✅ Sample disasters removed successfully');
      return true;
    } catch (error) {
      console.error('❌ Error removing disasters:', error);
      return false;
    }
  }
};
