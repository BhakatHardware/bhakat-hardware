import express from 'express';
import Debt from '../models/model.debt.js';
import authMiddleware from '../middleware/middleware.auth.js';

const router = express.Router();

router.use(authMiddleware);

// Get all debts
router.get('/', async (req, res) => {
  try {
    const debts = await Debt.find().sort({ createdAt: -1 });
    res.json(debts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new debt
router.post('/', async (req, res) => {
  try {
    const debt = new Debt(req.body);
    const saved = await debt.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update debt (e.g. log payment)
router.put('/:id', async (req, res) => {
  try {
    const { amountPaid, note, ...updates } = req.body;
    const debt = await Debt.findById(req.params.id);
    if (!debt) return res.status(404).json({ message: 'Debt not found' });

    if (amountPaid) {
      debt.amountDue -= amountPaid;
      debt.history.push({ amountPaid, note });
      if (debt.amountDue <= 0) {
        debt.amountDue = 0;
        debt.status = 'Paid';
      } else {
        debt.status = 'Partial';
      }
    }
    
    if (updates.customerName) debt.customerName = updates.customerName;
    if (updates.contactNumber) debt.contactNumber = updates.contactNumber;
    if (updates.description) debt.description = updates.description;

    const saved = await debt.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete debt
router.delete('/:id', async (req, res) => {
  try {
    await Debt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Debt removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
