import mongoose from 'mongoose';

/*
const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediaapp';
    await mongoose.connect(MONGO_URI); // Connect to MongoDB
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // Handle the error with proper logging
    console.error('❌ MongoDB connection failed:', error instanceof Error ? error.message : error);
    process.exit(1); // Exit the process
  }
};
*/

const connectDB = async (retries = 5): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI!;
  while (retries) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('✅ MongoDB connected successfully');
      break; // Exit loop on successful connection
    } catch (error) {
      console.error(`❌ MongoDB connection failed. Retries left: ${retries - 1}`, error);
      retries -= 1;
      if (!retries) {
        process.exit(1); // Exit process if all retries fail
      }
      await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
};
// Retry is particularly useful in production environments where network issues may occur temporarily.


export default connectDB;
