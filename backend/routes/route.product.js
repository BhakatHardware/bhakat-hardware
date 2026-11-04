import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/model.product.js';
import authMiddleware from '../middleware/middleware.auth.js';

const router = express.Router();

// GET /api/products — List all products (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50, lowStock } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { size: { $regex: search, $options: 'i' } },
      ];
    }
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

// POST /api/products — Create new product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name, category, subCategory, size, unit,
      purchasePrice, sellingPrice, totalStock,
      description, imageUrl,
      // also handle legacy parameter names if passed
      quantityBought,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Product name is required.' });
    }
    if (!unit || !unit.trim()) {
      return res.status(400).json({ message: 'Product unit is required.' });
    }

    const stockQty = totalStock !== undefined && totalStock !== ''
      ? Number(totalStock)
      : (quantityBought !== undefined && quantityBought !== '' ? Number(quantityBought) : 0);

    const costPrice = purchasePrice !== undefined && purchasePrice !== '' && !isNaN(Number(purchasePrice))
      ? Number(purchasePrice)
      : 0;

    const sellPrice = sellingPrice !== undefined && sellingPrice !== '' && !isNaN(Number(sellingPrice))
      ? Number(sellingPrice)
      : 0;

    const product = new Product({
      name: name.trim(),
      category: (category && category.trim()) || 'General Hardware',
      subCategory: subCategory?.trim() || '',
      size: size?.trim() || '',
      unit: unit.trim(),
      purchasePrice: costPrice,
      sellingPrice: sellPrice,
      totalStock: isNaN(stockQty) ? 0 : Math.max(0, stockQty),
      description: description?.trim() || '',
      imageUrl: imageUrl || '',
    });

    await product.save();
    res.status(201).json({ message: 'Product created.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/products/:id — Update product info
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const {
      name, category, subCategory, size, unit,
      purchasePrice, sellingPrice, totalStock,
      description, imageUrl
    } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: 'Product name cannot be empty.' });
      product.name = name.trim();
    }
    if (unit !== undefined) {
      if (!unit.trim()) return res.status(400).json({ message: 'Product unit cannot be empty.' });
      product.unit = unit.trim();
    }
    if (category !== undefined) product.category = category.trim() || 'General Hardware';
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (size !== undefined) product.size = size;
    if (purchasePrice !== undefined) product.purchasePrice = purchasePrice === '' ? 0 : Number(purchasePrice) || 0;
    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice === '' ? 0 : Number(sellingPrice) || 0;
    if (totalStock !== undefined) product.totalStock = totalStock === '' ? 0 : Number(totalStock) || 0;
    if (description !== undefined) product.description = description;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    await product.save();
    res.json({ message: 'Product updated.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/products/:id/restock (also alias /batch) — Add stock & optionally update purchase price
const handleRestock = async (req, res) => {
  try {
    const { purchasePrice, quantity, quantityBought } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const qty = Number(quantity ?? quantityBought ?? 0);
    product.totalStock = (product.totalStock || 0) + (isNaN(qty) ? 0 : qty);

    if (purchasePrice !== undefined && purchasePrice !== '' && !isNaN(Number(purchasePrice))) {
      product.purchasePrice = Number(purchasePrice);
    }

    await product.save();
    res.json({ message: 'Stock updated.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

router.post('/:id/restock', authMiddleware, handleRestock);
router.post('/:id/batch', authMiddleware, handleRestock);

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
