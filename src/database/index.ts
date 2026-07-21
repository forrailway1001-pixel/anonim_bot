import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../utils/logger';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('MongoDB Connected Successfully');
  } catch (error) {
    logger.error(error, 'MongoDB Connection Error:');
    process.exit(1);
  }
};
