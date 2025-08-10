const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));
    
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    });
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [results] = await sequelize.query('SELECT version();');
    console.log('📊 PostgreSQL version:', results[0].version.split(' ')[0]);
    
    await sequelize.close();
    console.log('🔐 Connection closed.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check DATABASE_URL in .env file');
    console.log('2. Verify Supabase project is running');
    console.log('3. Check if password is correct');
    console.log('4. Ensure connection string format is correct');
  }
}

testDatabaseConnection();
