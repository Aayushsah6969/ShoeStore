// controllers/user.controller.js
import pool from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../services/email.service.js';


const JWT_SECRET = process.env.JWT_SECRET;

export const signupUser = async (req, res) => {
  const { full_name, email, password } = req.body;
  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [full_name, email, hashedPassword]
    );

    res.status(201).json({success:true, message: 'User created',});
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('shoe_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const logoutUser = async (req, res) => {
    res.clearCookie('shoe_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.json({success:true, message: 'Logout successful' });
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user with matching email AND is_admin = true
    const adminRes = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_admin = TRUE',
      [email]
    );

    if (adminRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials or not an admin' });
    }

    const admin = adminRes.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials or not an admin' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('admin_token', token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({ success: true, message: 'Admin login successful' });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const logoutAdmin = async (req, res) => {
    res.clearCookie('admin_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.json({success:true, message: 'Logout successful' });
};

export async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid email is required.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  try {
    const userRes = await pool.query(
      'SELECT full_name FROM users WHERE email = $1',
      [email]
    );

    if (!userRes.rows.length) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const name = userRes.rows[0].full_name;

    await pool.query(
      `UPDATE users 
       SET reset_password_token = $1, reset_password_expires = $2 
       WHERE email = $3`,
      [token, expiry, email]
    );

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await sendResetPasswordEmail({ toEmail: email, toName: name, resetUrl: resetLink });

    return res.status(200).json({ success: true, message: 'Password reset email sent.' });

  } catch (err) {
    console.error('Error during password reset request:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
}

export async function resetPassword(req, res) {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, token, and new password are required.' });
  }

  try {
    const userRes = await pool.query(
      `SELECT id, full_name, reset_password_expires 
       FROM users 
       WHERE email = $1 AND reset_password_token = $2`,
      [email, token]
    );

    if (!userRes.rows.length) {
      return res.status(400).json({ success: false, message: 'Invalid token or email.' });
    }

    const { id, full_name: name, reset_password_expires: expires } = userRes.rows[0];

    if (new Date(expires) < new Date()) {
      return res.status(400).json({ success: false, message: 'Token has expired.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users 
       SET password = $1, reset_password_token = NULL, reset_password_expires = NULL 
       WHERE id = $2`,
      [hashed, id]
    );

    // Send confirmation email
    await sendResetPasswordEmail({
      toEmail: email,
      toName: name,
      isConfirmation: true // assuming sendResetPasswordEmail handles this
    });

    return res.status(200).json({ success: true, message: 'Password has been reset successfully.' });

  } catch (err) {
    console.error('Error during password reset:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
}
