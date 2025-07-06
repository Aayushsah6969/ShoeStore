// middleware/isAdmin.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db/db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const isAdmin = async (req, res, next) => {
  const token = req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No admin token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0 || !result.rows[0].is_admin) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    req.user = decoded; // Attach decoded token data if needed
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default isAdmin;
