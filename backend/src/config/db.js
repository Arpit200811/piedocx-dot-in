import mongoose from 'mongoose';

const connectDB = async (retryCount = 5) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (retryCount > 0) {
      console.warn(`⚠️ MongoDB connection failed. Retrying in 5 seconds... (${retryCount} retries left)`);
      console.error(`Error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retryCount - 1);
    } else {
      console.error('❌ MongoDB connection error (CRITICAL):', error.message);
      console.error('TIP: Check your internet connection or DNS settings. Sometimes "querySrv EREFUSED" happens due to local DNS blocking MongoDB SRV records.');
      process.exit(1);
    }
  }
};

export default connectDB;
