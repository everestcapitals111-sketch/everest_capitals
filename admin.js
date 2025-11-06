const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get pending KYC
router.get('/kyc/pending', authMiddleware, adminOnly, async (req, res) => {
  const list = await User.find({ kycStatus: 'pending' });
  res.json(list);
});

// Approve/Reject KYC
router.post('/kyc/:id/:action', authMiddleware, adminOnly, async (req, res) => {
  const { id, action } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ msg: 'Not found' });
  user.kycStatus = action === 'approve' ? 'approved' : 'rejected';
  await user.save();
  res.json({ msg: 'Updated' });
});

// Get pending transactions
router.get('/txs/pending', authMiddleware, adminOnly, async (req, res) => {
  const txs = await Transaction.find({ status: 'pending' }).populate('user');
  res.json(txs);
});

// Approve transaction and update user balance
router.post('/txs/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  const tx = await Transaction.findById(req.params.id).populate('user');
  if (!tx) return res.status(404).json({ msg: 'Tx not found' });
  if (tx.type === 'deposit') {
    tx.user.balance += tx.amount;
  } else if (tx.type === 'withdrawal') {
    if (tx.amount > tx.user.balance) return res.status(400).json({ msg: 'Insufficient' });
    tx.user.balance -= tx.amount;
  }
  tx.status = 'approved';
  await tx.user.save();
  await tx.save();
  res.json({ msg: 'Approved' });
});

// Reject transaction
router.post('/txs/:id/reject', authMiddleware, adminOnly, async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  tx.status = 'rejected';
  await tx.save();
  res.json({ msg: 'Rejected' });
});

// Adjust profitPercent for a user (percentage-wise profit/loss)
router.post('/users/:id/profit', authMiddleware, adminOnly, async (req, res) => {
  const { percent } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: 'Not found' });
  user.profitPercent = percent;
  user.balance = user.balance + (user.balance * percent) / 100;
  await user.save();
  res.json({ msg: 'Updated', user });
});

// Admin: simple in-memory payment account
let paymentAccount = { bankName: '', accountNumber: '', ifsc: '', upi: '' };
router.get('/payment-account', authMiddleware, adminOnly, (req, res) => { res.json(paymentAccount); });
router.post('/payment-account', authMiddleware, adminOnly, (req, res) => { paymentAccount = req.body; res.json({ msg: 'Saved' }); });

module.exports = router;
