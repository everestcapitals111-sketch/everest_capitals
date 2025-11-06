const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const upload = require('../utils/upload');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Upload KYC documents
router.post('/kyc', authMiddleware, upload.fields([{ name: 'aadhar' }, { name: 'pan' }]), async (req, res) => {
  const user = req.user;
  if (req.files?.aadhar) user.aadharUrl = req.files.aadhar[0].path;
  if (req.files?.pan) user.panUrl = req.files.pan[0].path;
  user.kycStatus = 'pending';
  await user.save();
  res.json({ msg: 'KYC uploaded' });
});

// Request deposit (creates pending transaction)
router.post('/deposit', authMiddleware, async (req, res) => {
  const { amount, meta } = req.body;
  const tx = await Transaction.create({ user: req.user._id, type: 'deposit', amount, status: 'pending', meta });
  res.json({ tx });
});

// Request withdrawal
router.post('/withdraw', authMiddleware, async (req, res) => {
  const { amount, meta } = req.body;
  if (amount > req.user.balance) return res.status(400).json({ msg: 'Insufficient balance' });
  const tx = await Transaction.create({ user: req.user._id, type: 'withdrawal', amount, status: 'pending', meta });
  res.json({ tx });
});

// Client dashboard summary
router.get('/dashboard', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id);
  const txs = await Transaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ balance: user.balance, profitPercent: user.profitPercent, kycStatus: user.kycStatus, txs });
});

module.exports = router;
