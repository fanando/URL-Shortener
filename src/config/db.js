// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,  // For older Mongoose versions
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // stop the app if we cannot connect
  }
};

module.exports = connectDB;
