import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/route.auth.js';
import productRoutes from './routes/route.product.js';
import saleRoutes from './routes/route.sale.js';
import projectRoutes from './routes/route.project.js';
import materialRoutes from './routes/route.material.js';
import dashboardRoutes from './routes/route.dashboard.js';
import uploadRoutes from './routes/route.upload.js';
import debtRoutes from './routes/route.debt.js';
import syncRoutes from './routes/route.sync.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: true, // Allow local network devices (e.g. phone on shop Wi-Fi)
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/sync', syncRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bhakat Hardware API is running', timestamp: new Date() });
});

// Connect to MongoDB (Prefer Local for 0ms shop counter speed, fallback to Atlas)
const mongoUri = process.env.LOCAL_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bhakat_hardware';

mongoose.connect(mongoUri)
  .then(() => {
    const isLocal = mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost');
    console.log(isLocal ? '✅ Local MongoDB Connected (Shop Offline Mode - 0ms)' : '✅ Cloud MongoDB Atlas Connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT} (Accessible across shop network)`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
