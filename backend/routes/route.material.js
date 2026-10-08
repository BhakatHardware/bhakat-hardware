import express from 'express';
import Material from '../models/model.material.js';
import authMiddleware from '../middleware/middleware.auth.js';

const router = express.Router();

// GET /api/materials — Public
router.get('/', async (req, res) => {
  try {
    const materials = await Material.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/materials/admin — Admin all
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const materials = await Material.find().sort({ order: 1, createdAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/materials
router.post('/', authMiddleware, async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json({ message: 'Material created.', material });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/materials/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ message: 'Material not found.' });
    res.json({ message: 'Material updated.', material });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/materials/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
