import express from 'express';
import Product from '../models/model.product.js';
import Sale from '../models/model.sale.js';
import authMiddleware from '../middleware/middleware.auth.js';

const router = express.Router();

// POST /api/sales — Record a sale
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      customerName, customerPhone, items,
      discount = 0, paymentMode, paymentStatus, amountPaid, note
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required.' });
    }

    const saleItems = [];
    let subtotal = 0;
    let totalCost = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found.` });
      if (product.totalStock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.totalStock}` });
      }

      const qty = Number(item.quantity);
      const price = Number(item.sellingPrice ?? product.sellingPrice ?? 0);
      const costPerUnit = Number(product.purchasePrice || 0);
      const lineRevenue = qty * price;
      const lineCost = qty * costPerUnit;

      subtotal += lineRevenue;
      totalCost += lineCost;

      product.totalStock -= qty;
      await product.save();

      saleItems.push({
        product: product._id,
        productName: product.name,
        productSku: product.sku,
        quantity: qty,
        sellingPrice: price,
        purchasePrice: costPerUnit,
        batchBreakdown: [],
        totalRevenue: lineRevenue,
        totalCost: lineCost,
        profit: lineRevenue - lineCost,
      });
    }

    const totalAmount = subtotal - discount;
    const totalProfit = totalAmount - totalCost;
    const paid = Number(amountPaid || totalAmount);

    const sale = new Sale({
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      items: saleItems,
      subtotal,
      discount: Number(discount),
      totalAmount,
      totalCost,
      totalProfit,
      paymentMode: paymentMode || 'Cash',
      paymentStatus: paymentStatus || 'Paid',
      amountPaid: paid,
      amountDue: totalAmount - paid,
      note: note || '',
    });

    await sale.save();
    res.status(201).json({ message: 'Sale recorded.', sale });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/sales — List all sales
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 30, startDate, endDate, paymentStatus } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) query.saleDate.$lte = new Date(endDate);
    }
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const sales = await Sale.find(query)
      .sort({ saleDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Sale.countDocuments(query);
    res.json({ sales, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/sales/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('items.product', 'name sku');
    if (!sale) return res.status(404).json({ message: 'Sale not found.' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/sales/product/:productId — Get sales history for a product
router.get('/product/:productId', authMiddleware, async (req, res) => {
  try {
    const sales = await Sale.find({ 'items.product': req.params.productId })
      .sort({ saleDate: -1 });

    // Filter down to only show the relevant item in the response to save bandwidth
    const history = sales.map(sale => {
      const item = sale.items.find(i => i.product.toString() === req.params.productId);
      return {
        saleId: sale._id,
        invoiceNumber: sale.invoiceNumber,
        saleDate: sale.saleDate,
        customerName: sale.customerName,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        profit: item.profit,
      };
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
