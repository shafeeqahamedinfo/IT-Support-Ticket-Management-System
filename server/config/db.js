const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * Supports local MongoDB and MongoDB Atlas.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB connection URI not found in environment variables (MONGO_URI / MONGODB_URI).');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
    });

    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}\n`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.log('   → Check MongoDB Atlas credentials and IP Whitelist (allow 0.0.0.0/0 on Atlas).\n');
    if (!process.env.VERCEL) {
      process.exit(1); // Exit process with failure in local server mode
    }
  }
};

// Handle connection events after initial connect
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully.');
});

module.exports = connectDB;
