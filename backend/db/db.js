// db/db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for some cloud DB providers (e.g., Railway, Supabase)
  },
});

// Optional: test connection once on startup
pool.connect()
  .then(() => console.log('🟢 Connected to PostgreSQL DB'))
  .catch((err) => console.error('🔴 DB Connection Error:', err));

export default pool;