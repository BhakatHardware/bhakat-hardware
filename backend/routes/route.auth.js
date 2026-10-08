import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Hardcoded Admin Credentials (from .env or fallback to defaults)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bhakat123';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required.' });
    }

    if (username.toLowerCase() !== ADMIN_USERNAME.toLowerCase() || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Token expires in 7 days, so the user doesn't have to login again for a week
    const token = jwt.sign(
      { id: 'admin_hardcoded_id', username: ADMIN_USERNAME, name: 'Admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, admin: { id: 'admin_hardcoded_id', username: ADMIN_USERNAME, name: 'Admin' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
