import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

// Load environment variables
dotenv.config({ path: './src/config/config.env' });

const testDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...'.yellow);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.green.bold);
    
    // Simple test query
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\n📋 Available Collections:'.cyan.bold);
    console.log(collections.length > 0 ? collections.map(c => `- ${c.name}`).join('\n') : 'No collections found');
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`.red.bold);
    console.log('\n🔧 Troubleshooting Tips:'.yellow);
    console.log('1. Make sure MongoDB is running'.yellow);
    console.log('2. Check your MONGODB_URI in config.env'.yellow);
    console.log('3. Verify your network connection'.yellow);
    console.log('4. Check if your IP is whitelisted in MongoDB Atlas (if using Atlas)'.yellow);
    process.exit(1);
  }
};

testDB();
