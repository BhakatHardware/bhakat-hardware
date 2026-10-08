import mongoose from 'mongoose';

// Each purchase batch for a product
const batchSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  purchaseDate: { type: Date, default: Date.now },
  purchasePrice: { type: Number, required: true },  // cost per unit
  quantityBought: { type: Number, required: true },
  quantityRemaining: { type: Number, required: true },
  note: { type: String, default: '' },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: [
      'General Hardware',
      'Plumbing',
      'Electrical',
      'Paint & Related',
      'Construction Materials',
      'Tools',
    ]
  },
  subCategory: { type: String, default: '' },
  size: { type: String, default: '' },           // e.g., "3/4 inch", "2mm"
  unit: { type: String, default: 'pcs' },        // pcs, kg, meter, bag, etc.
  sellingPrice: { type: Number, required: true }, // current selling price per unit
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sku: { type: String, unique: true, sparse: true },

  // All purchase batches
  batches: [batchSchema],

  // Computed / cached fields
  totalStock: { type: Number, default: 0 },       // sum of quantityRemaining across batches
  avgPurchasePrice: { type: Number, default: 0 }, // weighted avg cost
}, { timestamps: true });

// Auto-compute totalStock and avgPurchasePrice before save
productSchema.pre('save', function (next) {
  const activeBatches = this.batches.filter(b => b.quantityRemaining > 0);
  this.totalStock = activeBatches.reduce((sum, b) => sum + b.quantityRemaining, 0);
  if (activeBatches.length > 0) {
    const totalCost = activeBatches.reduce((sum, b) => sum + (b.purchasePrice * b.quantityRemaining), 0);
    this.avgPurchasePrice = totalCost / this.totalStock;
  }
  next();
});

// Auto-generate SKU
productSchema.pre('save', async function (next) {
  if (!this.sku) {
    const prefix = this.category.slice(0, 2).toUpperCase();
    const count = await mongoose.model('Product').countDocuments();
    this.sku = `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Product', productSchema);
