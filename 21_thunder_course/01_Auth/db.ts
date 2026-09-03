import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function connectDB() {
  try {
    const client = await db.connect();
    console.log('connected to database ✅');
    client.release();
  } catch (err) {
    console.error('error connecting to database ❌', err);
  }
}

connectDB();
