import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/login — Authenticate admin using credentials from .env
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const envUsername = (process.env.ADMIN_USERNAME || 'admin@123').trim();
    const envPassword = (process.env.ADMIN_PASSWORD || 'bhakat@123').trim();

    const inputUsername = String(username).trim();
    const inputPassword = String(password).trim();

    // Verify credentials directly against .env
    if (inputUsername !== envUsername || inputPassword !== envPassword) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'bhakat_hardware_super_secret_jwt_key_2026';
    const token = jwt.sign(
      { id: 'admin_id', username: envUsername, name: 'Admin' },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: { id: 'admin_id', username: envUsername, name: 'Admin' }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
