import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/model.product.js';
import authMiddleware from '../middleware/middleware.auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET /api/products — List all products (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50, lowStock } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (lowStock === 'true') query.totalStock = { $lte: 5 };

    const products = await Product.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/:id — Get single product
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/products — Create new product with first batch
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name, category, subCategory, size, unit,
      sellingPrice, description, imageUrl,
      purchasePrice, quantityBought, purchaseNote
    } = req.body;

    const firstBatch = {
      batchId: uuidv4().slice(0, 8).toUpperCase(),
      purchasePrice: Number(purchasePrice),
      quantityBought: Number(quantityBought),
      quantityRemaining: Number(quantityBought),
      note: purchaseNote || '',
      purchaseDate: new Date(),
    };

    const product = new Product({
      name, category, subCategory, size, unit,
      sellingPrice: Number(sellingPrice),
      description, imageUrl,
      batches: [firstBatch],
    });

    await product.save();
    res.status(201).json({ message: 'Product created.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/products/:id — Update product info (not batches)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, category, subCategory, size, unit, sellingPrice, description, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (name) product.name = name;
    if (category) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (size !== undefined) product.size = size;
    if (unit) product.unit = unit;
    if (sellingPrice) product.sellingPrice = Number(sellingPrice);
    if (description !== undefined) product.description = description;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    await product.save();
    res.json({ message: 'Product updated.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/products/:id/batch — Add a new purchase batch (restock)
router.post('/:id/batch', authMiddleware, async (req, res) => {
  try {
    const { purchasePrice, quantityBought, purchaseNote } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const newBatch = {
      batchId: uuidv4().slice(0, 8).toUpperCase(),
      purchasePrice: Number(purchasePrice),
      quantityBought: Number(quantityBought),
      quantityRemaining: Number(quantityBought),
      note: purchaseNote || '',
      purchaseDate: new Date(),
    };

    product.batches.push(newBatch);
    await product.save();
    res.json({ message: 'Batch added.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/products/:id — Soft delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/categories/list — Get all categories with counts
router.get('/categories/list', authMiddleware, async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$totalStock' } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
