import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`.red.bold);
  process.exit(1);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected'.yellow.bold);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination'.red.bold);
  process.exit(0);
});

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

const connectDB = async () => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, options);
      
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
      return conn;
    } catch (error) {
      retries++;
      console.error(
        `MongoDB connection attempt ${retries} failed: ${error.message}`.red.underline
      );
      
      if (retries === maxRetries) {
        console.error('Max retries reached. Exiting...'.red.bold);
        process.exit(1);
      }
      
      // Wait for 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

export default connectDB;
