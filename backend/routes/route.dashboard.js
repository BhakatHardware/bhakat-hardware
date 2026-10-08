import express from 'express';
import Product from '../models/model.product.js';
import Sale from '../models/model.sale.js';
import Project from '../models/model.project.js';
import Material from '../models/model.material.js';
import authMiddleware from '../middleware/middleware.auth.js';

const router = express.Router();

// GET /api/dashboard — Full dashboard stats
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Inventory stats
    const products = await Product.find({ isActive: true });
    const totalSKUs = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.totalStock, 0);
    const lowStockItems = products.filter(p => p.totalStock <= 5).length;
    const outOfStock = products.filter(p => p.totalStock === 0).length;

    // Total inventory value (at purchase cost)
    const inventoryValue = products.reduce((sum, p) => sum + (p.avgPurchasePrice * p.totalStock), 0);
    const inventoryRetailValue = products.reduce((sum, p) => sum + (p.sellingPrice * p.totalStock), 0);

    // Sales stats
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const todaySales = await Sale.aggregate([
      { $match: { saleDate: { $gte: startOfToday } } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, profit: { $sum: '$totalProfit' }, count: { $sum: 1 } } }
    ]);

    const monthSales = await Sale.aggregate([
      { $match: { saleDate: { $gte: startOfMonth } } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, profit: { $sum: '$totalProfit' }, count: { $sum: 1 } } }
    ]);

    const yearSales = await Sale.aggregate([
      { $match: { saleDate: { $gte: startOfYear } } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, profit: { $sum: '$totalProfit' }, count: { $sum: 1 } } }
    ]);

    const allTimeSales = await Sale.aggregate([
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, profit: { $sum: '$totalProfit' }, count: { $sum: 1 } } }
    ]);

    // Last 7 days revenue chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dEnd = new Date(d);
      dEnd.setHours(23, 59, 59, 999);

      const dayData = await Sale.aggregate([
        { $match: { saleDate: { $gte: d, $lte: dEnd } } },
        { $group: { _id: null, revenue: { $sum: '$totalAmount' }, profit: { $sum: '$totalProfit' } } }
      ]);

      last7Days.push({
        date: d.toISOString().split('T')[0],
        revenue: dayData[0]?.revenue || 0,
        profit: dayData[0]?.profit || 0,
      });
    }

    // Category breakdown
    const categoryBreakdown = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$totalStock' } } },
      { $sort: { count: -1 } }
    ]);

    // Pending dues
    const pendingDues = await Sale.aggregate([
      { $match: { paymentStatus: { $in: ['Partial', 'Pending'] } } },
      { $group: { _id: null, totalDue: { $sum: '$amountDue' } } }
    ]);

    // Recent sales
    const recentSales = await Sale.find().sort({ saleDate: -1 }).limit(5);

    // Top selling products (by quantity)
    const topProducts = await Sale.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.productName', totalQty: { $sum: '$items.quantity' }, totalRevenue: { $sum: '$items.totalRevenue' } } },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      inventory: {
        totalSKUs,
        totalStock,
        lowStockItems,
        outOfStock,
        inventoryValue: Math.round(inventoryValue),
        inventoryRetailValue: Math.round(inventoryRetailValue),
      },
      sales: {
        today: todaySales[0] || { revenue: 0, profit: 0, count: 0 },
        month: monthSales[0] || { revenue: 0, profit: 0, count: 0 },
        year: yearSales[0] || { revenue: 0, profit: 0, count: 0 },
        allTime: allTimeSales[0] || { revenue: 0, profit: 0, count: 0 },
      },
      last7Days,
      categoryBreakdown,
      pendingDues: pendingDues[0]?.totalDue || 0,
      recentSales,
      topProducts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
