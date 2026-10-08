import mongoose from 'mongoose';

// Individual line items in a sale
const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productSku: { type: String },
  quantity: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },  // price at time of sale

  // Batch mode: track which batches stock came from for profit calc
  batchBreakdown: [{
    batchId: { type: String },
    quantityFromBatch: { type: Number },
    purchasePriceAtBatch: { type: Number },
  }],

  // Computed profit for this line item
  totalRevenue: { type: Number, required: true },
  totalCost: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
});

const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  customerName: { type: String, default: 'Walk-in Customer' },
  customerPhone: { type: String, default: '' },
  items: [saleItemSchema],

  // Totals
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  totalCost: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },

  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Credit', 'Cheque', 'Other'],
    default: 'Cash'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Partial', 'Pending'],
    default: 'Paid'
  },
  amountPaid: { type: Number, default: 0 },
  amountDue: { type: Number, default: 0 },

  note: { type: String, default: '' },
  saleDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Auto-generate invoice number
saleSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Sale').countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    this.invoiceNumber = `BH-${year}${month}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Sale', saleSchema);
