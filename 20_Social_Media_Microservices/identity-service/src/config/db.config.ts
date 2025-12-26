import mongoose from 'mongoose';

import { ENV } from './env.config';

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('MongoDb Connected successfully✅');
  } catch (error) {
    console.log('MongoDb Connection fialed 👎');
    process.exit(1);
  }
};
