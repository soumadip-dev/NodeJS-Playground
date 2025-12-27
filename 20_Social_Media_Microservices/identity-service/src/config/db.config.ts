import mongoose from 'mongoose';
import logger from '../utils/logger.utils';

import { ENV } from './env.config';

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    logger.info('MongoDb Connected successfully');
    console.log('MongoDb Connected successfully✅');
  } catch (error) {
    logger.error('MongoDb Connection fialed');
    console.log('MongoDb Connection fialed 👎');
    process.exit(1);
  }
};
