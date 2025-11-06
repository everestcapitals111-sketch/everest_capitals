const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client','admin'], default: 'client' },
  aadharUrl: String,
  panUrl: String,
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifsc: String,
    upi: String
  },
  kycStatus: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  balance: { type: Number, default: 0 },
  profitPercent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
