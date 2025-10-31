import mongoose from 'mongoose';

console.log('Testing MongoDB connection...');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/racefi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
