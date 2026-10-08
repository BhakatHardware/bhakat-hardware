import mongoose from 'mongoose';

const debtSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contactNumber: { type: String },
  amountDue: { type: Number, required: true, min: 0 },
  description: { type: String }, // What materials they took
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Unpaid', 'Partial', 'Paid'], default: 'Unpaid' },
  history: [{
    amountPaid: Number,
    date: { type: Date, default: Date.now },
    note: String
  }]
}, { timestamps: true });

const Debt = mongoose.model('Debt', debtSchema);
export default Debt;
