// middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db/db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const auth = async (req, res, next) => {
  const token = req.cookies?.shoe_token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Unauthorized: Invalid user' });
    }

    req.user = decoded; // Attach user info to req object
    next();
  } catch (err) {
    console.error('User token verification error:', err);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

export default auth;
