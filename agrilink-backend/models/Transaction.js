const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: [true, 'Payment method reference is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  transactionType: {
    type: String,
    enum: ['payment', 'refund', 'withdrawal', 'verification'],
    required: [true, 'Transaction type is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  reference: {
    type: String,
    unique: true,
    uppercase: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Generate unique reference before saving
transactionSchema.pre('save', function(next) {
  if (!this.reference) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    this.reference = `TXN-${timestamp}-${random}`;
  }
  next();
});

// Index for better query performance
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);