// scripts/insertAdmin.js
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import pool from './db/db.js';

dotenv.config();

const insertAdmin = async () => {
  const full_name = 'Admin';
  const email = 'adminShoe@gmail.com';
  const password = 'admin123'; // You can change this to something more secure
  const is_admin = true;

  try {
    // Check if admin already exists
    const existing = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      console.log('⚠️ Admin already exists.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
      [full_name, email, hashedPassword, is_admin]
    );

    console.log('✅ Admin inserted:', result.rows[0]);
  } catch (err) {
    console.error('❌ Error inserting admin:', err);
  } finally {
    pool.end(); // close db connection
  }
};

insertAdmin();
