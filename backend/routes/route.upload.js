import express from 'express';
import { upload } from '../middleware/middleware.upload.js';
import authMiddleware from '../middleware/middleware.auth.js';

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }
  
  // multer-storage-cloudinary attaches the path property containing the Cloudinary URL
  res.json({ imageUrl: req.file.path });
});

export default router;
