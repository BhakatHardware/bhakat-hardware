import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import authMiddleware from '../middleware/middleware.auth.js';

import Product from '../models/model.product.js';
import Sale from '../models/model.sale.js';
import Debt from '../models/model.debt.js';
import Material from '../models/model.material.js';
import Project from '../models/model.project.js';
import Admin from '../models/model.admin.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const metaFile = path.join(__dirname, '..', 'sync_meta.json');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: read last sync meta
const getSyncMeta = () => {
  try {
    if (fs.existsSync(metaFile)) {
      return JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    }
  } catch { /* ignore */ }
  return { lastSyncedAt: null, lastAction: null };
};

// Helper: save last sync meta
const saveSyncMeta = (action, details = {}) => {
  try {
    const meta = {
      lastSyncedAt: new Date().toISOString(),
      lastAction: action,
      details,
    };
    fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
    return meta;
  } catch (err) {
    console.warn('Failed to write sync_meta.json:', err.message);
  }
};

// Helper: open an isolated secondary connection to Cloud Atlas
async function withCloudConnection(callback) {
  const cloudUri = process.env.CLOUD_MONGO_URI;
  if (!cloudUri) {
    throw new Error('CLOUD_MONGO_URI is not configured in .env');
  }

  const cloudConn = await mongoose.createConnection(cloudUri, {
    serverSelectionTimeoutMS: 10000,
  }).asPromise();

  try {
    return await callback(cloudConn);
  } finally {
    try {
      await cloudConn.close();
    } catch { /* ignore */ }
  }
}

// 1. GET /api/sync/status — Current database & sync status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const [products, sales, debts, materials, projects] = await Promise.all([
      Product.countDocuments(),
      Sale.countDocuments(),
      Debt.countDocuments(),
      Material.countDocuments(),
      Project.countDocuments(),
    ]);

    // Count pending local images
    const [pendingProdImgs, pendingMatImgs, pendingProjImgs] = await Promise.all([
      Product.countDocuments({ imageUrl: { $regex: '^/uploads/' } }),
      Material.countDocuments({ imageUrl: { $regex: '^/uploads/' } }),
      Project.countDocuments({ imageUrl: { $regex: '^/uploads/' } }),
    ]);

    const pendingImages = pendingProdImgs + pendingMatImgs + pendingProjImgs;
    const meta = getSyncMeta();

    res.json({
      isLocal: (process.env.MONGO_URI || '').includes('127.0.0.1') || (process.env.MONGO_URI || '').includes('localhost'),
      hasCloudConfig: !!process.env.CLOUD_MONGO_URI,
      counts: { products, sales, debts, materials, projects },
      pendingImages,
      lastSyncedAt: meta.lastSyncedAt,
      lastAction: meta.lastAction,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get sync status', error: err.message });
  }
});

// Helper: upload local files to Cloudinary and update local documents
async function uploadPendingLocalImages() {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  let uploadedCount = 0;

  const modelsWithImages = [
    { model: Product, name: 'Product' },
    { model: Material, name: 'Material' },
    { model: Project, name: 'Project' },
  ];

  for (const { model } of modelsWithImages) {
    const items = await model.find({ imageUrl: { $regex: '^/uploads/' } });
    for (const item of items) {
      const filename = path.basename(item.imageUrl);
      const fullPath = path.join(uploadsDir, filename);

      if (fs.existsSync(fullPath)) {
        try {
          const res = await cloudinary.uploader.upload(fullPath, {
            folder: 'bhakat-hardware',
          });
          item.imageUrl = res.secure_url;
          await item.save();
          uploadedCount++;
        } catch (uploadErr) {
          console.warn(`[SYNC] Failed to upload ${filename} to Cloudinary:`, uploadErr.message);
        }
      }
    }
  }

  return uploadedCount;
}

// 2. POST /api/sync/push — Push Local changes to Cloud Atlas
router.post('/push', authMiddleware, async (req, res) => {
  try {
    // Step 1: Upload any pending offline photos to Cloudinary
    const uploadedImages = await uploadPendingLocalImages();

    // Step 2: Push collections to Cloud Atlas
    const pushResults = await withCloudConnection(async (cloudConn) => {
      const collections = [
        { model: Product, col: 'products' },
        { model: Sale, col: 'sales' },
        { model: Debt, col: 'debts' },
        { model: Material, col: 'materials' },
        { model: Project, col: 'projects' },
      ];

      const stats = {};

      for (const { model, col } of collections) {
        const localDocs = await model.find().lean();
        if (localDocs.length > 0) {
          const ops = localDocs.map(doc => ({
            replaceOne: {
              filter: { _id: doc._id },
              replacement: doc,
              upsert: true,
            }
          }));
          const result = await cloudConn.collection(col).bulkWrite(ops);
          stats[col] = {
            total: localDocs.length,
            upserted: result.upsertedCount,
            modified: result.modifiedCount,
          };
        } else {
          stats[col] = { total: 0, upserted: 0, modified: 0 };
        }
      }

      return stats;
    });

    const meta = saveSyncMeta('PUSH', { uploadedImages, pushResults });

    res.json({
      message: 'Successfully pushed all local data to Cloud Atlas!',
      uploadedImages,
      pushResults,
      lastSyncedAt: meta.lastSyncedAt,
    });
  } catch (err) {
    console.error('[SYNC PUSH ERROR]', err);
    res.status(500).json({ message: 'Push sync failed. Check your internet connection.', error: err.message });
  }
});

// 3. POST /api/sync/pull — Pull updates from Cloud Atlas into Local DB
router.post('/pull', authMiddleware, async (req, res) => {
  try {
    const pullResults = await withCloudConnection(async (cloudConn) => {
      const collections = [
        { model: Product, col: 'products' },
        { model: Sale, col: 'sales' },
        { model: Debt, col: 'debts' },
        { model: Material, col: 'materials' },
        { model: Project, col: 'projects' },
      ];

      const stats = {};

      for (const { model, col } of collections) {
        const cloudDocs = await cloudConn.collection(col).find().toArray();
        if (cloudDocs.length > 0) {
          const ops = cloudDocs.map(doc => ({
            replaceOne: {
              filter: { _id: doc._id },
              replacement: doc,
              upsert: true,
            }
          }));
          const result = await model.bulkWrite(ops);
          stats[col] = {
            total: cloudDocs.length,
            upserted: result.upsertedCount,
            modified: result.modifiedCount,
          };
        } else {
          stats[col] = { total: 0, upserted: 0, modified: 0 };
        }
      }

      return stats;
    });

    const meta = saveSyncMeta('PULL', { pullResults });

    res.json({
      message: 'Successfully pulled all data from Cloud Atlas to Local!',
      pullResults,
      lastSyncedAt: meta.lastSyncedAt,
    });
  } catch (err) {
    console.error('[SYNC PULL ERROR]', err);
    res.status(500).json({ message: 'Pull sync failed. Check your internet connection.', error: err.message });
  }
});

// 4. POST /api/sync/two-way — Smart Sync (Pull first, then Push)
router.post('/two-way', authMiddleware, async (req, res) => {
  try {
    // 1. Pull changes from cloud first (e.g. overnight changes by father)
    const pullStats = await withCloudConnection(async (cloudConn) => {
      const collections = [
        { model: Product, col: 'products' },
        { model: Sale, col: 'sales' },
        { model: Debt, col: 'debts' },
        { model: Material, col: 'materials' },
        { model: Project, col: 'projects' },
      ];

      const stats = {};
      for (const { model, col } of collections) {
        const cloudDocs = await cloudConn.collection(col).find().toArray();
        if (cloudDocs.length > 0) {
          const ops = cloudDocs.map(doc => ({
            replaceOne: {
              filter: { _id: doc._id },
              replacement: doc,
              upsert: true,
            }
          }));
          await model.bulkWrite(ops);
          stats[col] = cloudDocs.length;
        } else {
          stats[col] = 0;
        }
      }
      return stats;
    });

    // 2. Upload any offline photos taken today to Cloudinary
    const uploadedImages = await uploadPendingLocalImages();

    // 3. Push local changes to Cloud Atlas
    const pushStats = await withCloudConnection(async (cloudConn) => {
      const collections = [
        { model: Product, col: 'products' },
        { model: Sale, col: 'sales' },
        { model: Debt, col: 'debts' },
        { model: Material, col: 'materials' },
        { model: Project, col: 'projects' },
      ];

      const stats = {};
      for (const { model, col } of collections) {
        const localDocs = await model.find().lean();
        if (localDocs.length > 0) {
          const ops = localDocs.map(doc => ({
            replaceOne: {
              filter: { _id: doc._id },
              replacement: doc,
              upsert: true,
            }
          }));
          await cloudConn.collection(col).bulkWrite(ops);
          stats[col] = localDocs.length;
        } else {
          stats[col] = 0;
        }
      }
      return stats;
    });

    const meta = saveSyncMeta('TWO_WAY', { pullStats, pushStats, uploadedImages });

    res.json({
      message: 'Two-way sync completed successfully! Both Local & Cloud are completely up to date.',
      pullStats,
      pushStats,
      uploadedImages,
      lastSyncedAt: meta.lastSyncedAt,
    });
  } catch (err) {
    console.error('[SYNC TWO-WAY ERROR]', err);
    res.status(500).json({ message: 'Sync failed. Please check internet connection.', error: err.message });
  }
});

export default router;
