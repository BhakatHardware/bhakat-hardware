import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  completionYear: { type: Number },
  imageUrl: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Other'],
    default: 'Residential'
  },
  materials: [{ type: String }],   // List of materials used
  clientName: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
