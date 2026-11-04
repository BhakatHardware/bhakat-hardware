import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    default: 'General Hardware',
    trim: true,
  },
  subCategory: { type: String, default: '' },
  size: { type: String, default: '' },           // e.g., "3/4 inch", "2mm"
  unit: { type: String, required: true, default: 'pcs', trim: true },        // pcs, kg, meter, bag, etc. (mandatory)
  purchasePrice: { type: Number, default: 0 },   // purchase/cost price per unit (can change anytime)
  sellingPrice: { type: Number, default: 0 },    // selling price per unit
  totalStock: { type: Number, default: 0 },      // stock quantity in hand
  avgPurchasePrice: { type: Number, default: 0 }, // synced with purchasePrice for backward compatibility
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sku: { type: String, unique: true, sparse: true },
}, { timestamps: true });

// Keep avgPurchasePrice in sync with purchasePrice
productSchema.pre('save', function () {
  if (this.purchasePrice !== undefined) {
    this.avgPurchasePrice = this.purchasePrice;
  }
});

// Auto-generate SKU
productSchema.pre('save', async function () {
  if (!this.sku) {
    const prefix = (this.category || 'GE').slice(0, 2).toUpperCase();
    const count = await mongoose.model('Product').countDocuments();
    this.sku = `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }
});

export default mongoose.model('Product', productSchema);
