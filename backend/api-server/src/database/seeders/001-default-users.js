const { User } = require('../../models');

module.exports = {
  up: async () => {
    try {
      // Create default admin user
      const adminUser = await User.findOrCreate({
        where: { wallet_address: '0x742d35Cc6e3A597E7CDD03C3a93B4c4c9b5c5D4E' },
        defaults: {
          wallet_address: '0x742d35Cc6e3A597E7CDD03C3a93B4c4c9b5c5D4E',
          email: 'admin@disasterrelief.network',
          name: 'System Administrator',
          role: 'admin',
          status: 'active',
          verification_status: 'verified',
          profile_data: {
            organization: 'Disaster Relief Network',
            position: 'System Administrator',
            location: 'Global'
          },
          preferences: {
            notifications: {
              email: true,
              sms: false,
              push: true
            },
            dashboard: {
              theme: 'light',
              language: 'en'
            }
          }
        }
      });

      // Create treasury user
      const treasuryUser = await User.findOrCreate({
        where: { wallet_address: '0x1234567890AbCdEf1234567890AbCdEf12345678' },
        defaults: {
          wallet_address: '0x1234567890AbCdEf1234567890AbCdEf12345678',
          email: 'treasury@disasterrelief.network',
          name: 'Treasury Manager',
          role: 'treasury',
          status: 'active',
          verification_status: 'verified',
          profile_data: {
            organization: 'Disaster Relief Treasury',
            position: 'Treasury Manager'
          }
        }
      });

      // Create oracle user
      const oracleUser = await User.findOrCreate({
        where: { wallet_address: '0xAbCdEf1234567890AbCdEf1234567890AbCdEf12' },
        defaults: {
          wallet_address: '0xAbCdEf1234567890AbCdEf1234567890AbCdEf12',
          email: 'oracle@disasterrelief.network',
          name: 'Data Oracle',
          role: 'oracle',
          status: 'active',
          verification_status: 'verified',
          profile_data: {
            organization: 'Relief Data Oracle',
            position: 'Data Verifier'
          }
        }
      });

      // Create government user
      const governmentUser = await User.findOrCreate({
        where: { wallet_address: '0xFedCbA0987654321FedCbA0987654321FedCbA09' },
        defaults: {
          wallet_address: '0xFedCbA0987654321FedCbA0987654321FedCbA09',
          email: 'government@disasterrelief.network',
          name: 'Government Official',
          role: 'government',
          status: 'active',
          verification_status: 'verified',
          profile_data: {
            organization: 'Emergency Management Agency',
            position: 'Relief Coordinator'
          }
        }
      });

      // Create sample donor users
      const donors = [
        {
          wallet_address: '0x1111111111222222222233333333334444444444',
          email: 'donor1@example.com',
          name: 'John Doe',
          role: 'donor'
        },
        {
          wallet_address: '0x2222222222333333333344444444445555555555',
          email: 'donor2@example.com',
          name: 'Jane Smith',
          role: 'donor'
        },
        {
          wallet_address: '0x3333333333444444444455555555556666666666',
          email: 'donor3@example.com',
          name: 'Bob Johnson',
          role: 'donor'
        }
      ];

      for (const donorData of donors) {
        await User.findOrCreate({
          where: { wallet_address: donorData.wallet_address },
          defaults: {
            ...donorData,
            status: 'active',
            verification_status: 'unverified',
            profile_data: {
              donationHistory: [],
              preferredCauses: ['disaster-relief', 'emergency-aid']
            }
          }
        });
      }

      console.log('✅ Default users seeded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error seeding users:', error);
      return false;
    }
  },

  down: async () => {
    try {
      await User.destroy({
        where: {
          wallet_address: [
            '0x742d35Cc6e3A597E7CDD03C3a93B4c4c9b5c5D4E',
            '0x1234567890AbCdEf1234567890AbCdEf12345678',
            '0xAbCdEf1234567890AbCdEf1234567890AbCdEf12',
            '0xFedCbA0987654321FedCbA0987654321FedCbA09',
            '0x1111111111222222222233333333334444444444',
            '0x2222222222333333333344444444445555555555',
            '0x3333333333444444444455555555556666666666'
          ]
        }
      });
      console.log('✅ Default users removed successfully');
      return true;
    } catch (error) {
      console.error('❌ Error removing users:', error);
      return false;
    }
  }
};
