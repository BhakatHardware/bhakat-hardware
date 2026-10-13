import express from 'express';
import { upload } from '../middleware/middleware.upload.js';
import authMiddleware from '../middleware/middleware.auth.js';

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  // Returns local path accessible via static /uploads route
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl, filename: req.file.filename });
});

export default router;
