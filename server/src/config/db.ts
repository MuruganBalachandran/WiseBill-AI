// region imports
import mongoose from 'mongoose';
import { env } from './env.js';
// endregion

// region function for database connection
export const connectToDatabase = async () => {
  try {
    // Database connection
    const dbUri = env?.db?.uri ?? 'mongodb://localhost:27017/default_db';
    await mongoose.connect(dbUri);  
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    // Error handling
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
// endregion
