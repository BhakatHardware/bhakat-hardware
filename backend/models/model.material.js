import mongoose from 'mongoose';

// Website-facing catalog material (different from inventory product)
const materialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  tag: {
    type: String,
    enum: ['Exclusive', 'Premium', 'Local', 'Imported', ''],
    default: ''
  },
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Material', materialSchema);
