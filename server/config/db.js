const mongoose = require('mongoose');

// Disable buffering so API calls fail immediately if DB is disconnected
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/meetgraph', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️ Shutting down server because database connection is required.');
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected!');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected!');
});

module.exports = connectDB;
