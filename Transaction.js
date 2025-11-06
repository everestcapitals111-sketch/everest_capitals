const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit','withdrawal','adjustment'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  meta: Object
}, { timestamps: true });

module.exports = mongoose.model('Transaction', txSchema);
