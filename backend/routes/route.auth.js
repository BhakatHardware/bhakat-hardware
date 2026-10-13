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

    const envUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    const envPass = (process.env.ADMIN_PASSWORD || 'bhakat123').trim();

    const inputUser = String(username).trim();
    const inputPass = String(password).trim();

    // Check credentials against .env or defaults
    const isUserValid = (
      inputUser.toLowerCase() === envUser.toLowerCase() ||
      inputUser.toLowerCase() === 'admin' ||
      inputUser.toLowerCase() === 'admin@123'
    );

    const isPassValid = (
      inputPass === envPass ||
      inputPass === 'bhakat@123' ||
      inputPass === 'bhakat123'
    );

    if (!isUserValid || !isPassValid) {
      console.warn(`[AUTH] Failed login attempt: username="${inputUser}"`);
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    console.log(`[AUTH] Admin logged in successfully: username="${inputUser}"`);

    const jwtSecret = process.env.JWT_SECRET || 'bhakat_hardware_super_secret_jwt_key_2026';
    const token = jwt.sign(
      { id: 'admin_hardcoded_id', username: inputUser, name: 'Admin' },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({ token, admin: { id: 'admin_hardcoded_id', username: inputUser, name: 'Admin' } });
  } catch (err) {
    console.error('[AUTH ERROR]', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
