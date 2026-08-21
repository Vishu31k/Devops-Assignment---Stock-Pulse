const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB
    // We only connect if MONGO_URI is present, helpful for mock testing
    if (process.env.MONGO_URI) {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('MongoDB URI missing. Skipping connection (this is fine for tests)');
    }
  } catch (error) {
    console.warn(`MongoDB not connected (${error.message}). Running in mock/standalone mode.`);
  }
};

module.exports = connectDB;
