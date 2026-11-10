import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { upload } from '../middleware/middleware.upload.js';
import authMiddleware from '../middleware/middleware.auth.js';

const router = express.Router();

// Helper to configure Cloudinary dynamically
const getCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

// GET /api/upload/status — Verify Cloudinary connection and health
router.get('/status', async (req, res) => {
  const isConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (!isConfigured) {
    return res.status(200).json({
      connected: false,
      message: 'Cloudinary credentials are not configured in .env',
    });
  }

  try {
    const cld = getCloudinary();
    const pingResult = await cld.api.ping();
    return res.json({
      connected: true,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      ping: pingResult,
      message: 'Cloudinary is active and ready.',
    });
  } catch (err) {
    return res.status(500).json({
      connected: false,
      message: 'Cloudinary ping failed: ' + err.message,
    });
  }
});

// POST /api/upload — Upload product, material, or project image
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }

  const isConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  // 1. Primary: Upload directly to Cloudinary CDN
  if (isConfigured) {
    try {
      const cld = getCloudinary();
      const uploadResult = await cld.uploader.upload(req.file.path, {
        folder: 'bhakat-hardware/products',
        resource_type: 'image',
      });

      // Remove temporary local file from uploads directory
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanErr) {
        console.warn('Failed to delete temporary local file:', cleanErr.message);
      }

      return res.json({
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        filename: req.file.filename,
        provider: 'cloudinary',
      });
    } catch (cloudErr) {
      console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
      // Fall through to offline local storage fallback
    }
  }

  // 2. Offline / Local fallback
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({
    imageUrl,
    filename: req.file.filename,
    provider: 'local',
    offline: true,
  });
});

export default router;
