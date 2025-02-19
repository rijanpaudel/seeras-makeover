import express from 'express';
import Purchase from '../models/Purchase.js';

const router = express.Router();

// Get user's purchase history
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const purchases = await Purchase.find({ userId })
      .populate('items.product')
      .sort({ date: -1 });

    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Error fetching purchase history', error: error.message });
  }
});

export default router;