const db = require('./src/models');
const { User, Disaster, SystemSettings } = db;

async function testDatabase() {
  console.log('🧪 Testing Database Infrastructure...\n');
  
  try {
    // Test connection
    console.log('1. Testing database connection...');
    await db.sequelize.authenticate();
    console.log('✅ Database connection successful\n');
    
    // Create tables if they don't exist
    console.log('2. Ensuring database tables exist...');
    await db.sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized\n');
    
    // Test User model
    console.log('3. Testing User model...');
    const user = await User.create({
      wallet_address: '0x742d35Cc6e3A597E7CDD03C3a93B4c4c9b5c5D4E',
      email: 'admin@relief.network',
      name: 'Admin User',
      role: 'admin',
      status: 'active'
    });
    console.log(`✅ User created with ID: ${user.id}`);
    
    // Test User methods
    const hashResult = await user.hashPassword('test123');
    console.log(`✅ Password hashing works: ${hashResult}`);
    
    const isValid = await user.validatePassword('test123');
    console.log(`✅ Password validation works: ${isValid}`);
    
    // Test SystemSettings model
    console.log('\n4. Testing SystemSettings model...');
    const setting = await SystemSettings.setSetting('app.name', 'Disaster Relief Network', 'string', 'Application name');
    console.log(`✅ System setting created: ${setting.key} = ${setting.value}`);
    
    const retrievedValue = await SystemSettings.getSetting('app.name');
    console.log(`✅ System setting retrieved: ${retrievedValue}`);
    
    // Test Disaster model
    console.log('\n5. Testing Disaster model...');
    const disaster = await Disaster.create({
      name: 'Test Earthquake Response',
      type: 'earthquake',
      severity: 'high',
      location: 'Test City',
      description: 'Testing disaster creation',
      declared_by: user.id,
      status: 'active',
      estimated_affected: 1000,
      funding_goal: 100000,
      metadata: { test: true }
    });
    console.log(`✅ Disaster created with ID: ${disaster.id}`);
    
    // Test relationships
    console.log('\n6. Testing model relationships...');
    const userWithDisasters = await User.findByPk(user.id, {
      include: [{ model: Disaster, as: 'declaredDisasters' }]
    });
    console.log(`✅ User has ${userWithDisasters.declaredDisasters.length} declared disasters`);
    
    console.log('\n🎉 All database tests passed! The infrastructure is working correctly.\n');
    
    // Cleanup
    await disaster.destroy();
    await user.destroy();
    await setting.destroy();
    
    console.log('🧹 Test data cleaned up successfully.\n');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await db.sequelize.close();
  }
}

testDatabase();
