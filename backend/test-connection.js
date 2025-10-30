import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

// Load environment variables
dotenv.config({ path: './src/config/config.env' });

console.log('🔍 Environment Variables:'.yellow);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`.cyan);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set!'}`.cyan);

console.log('\n🔌 Testing MongoDB Connection...'.yellow);

// Simple connection test
const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    
    console.log('✅ MongoDB Connected Successfully!'.green.bold);
    console.log(`Host: ${conn.connection.host}`.cyan);
    
    // List all collections
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log('\n📋 Available Collections:'.cyan.bold);
      console.log(collections.length > 0 
        ? collections.map(c => `- ${c.name}`).join('\n') 
        : 'No collections found');
    } catch (err) {
      console.warn('⚠️ Could not list collections:'.yellow, err.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection Error:'.red.bold);
    console.error('Error Name:'.red, error.name);
    console.error('Error Message:'.red, error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.log('\n🔧 Troubleshooting Tips:'.yellow);
      console.log('1. Check if MongoDB is running'.yellow);
      console.log('2. Verify the MONGODB_URI in config.env'.yellow);
      console.log('3. Check your internet connection'.yellow);
      console.log('4. If using Atlas, ensure your IP is whitelisted'.yellow);
      console.log('5. Try pinging the MongoDB server:'.yellow);
      console.log('   ping cluster0.xxxxx.mongodb.net'.yellow);
    }
    
    process.exit(1);
  }
};

testConnection();
