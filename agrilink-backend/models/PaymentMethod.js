const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  methodType: {
    type: String,
    enum: ['card', 'mobile_money'],
    required: [true, 'Method type is required']
  },
  
  // Card payment fields
  cardNumber: {
    type: String,
    required: function() { return this.methodType === 'card'; }
  },
  cardHolderName: {
    type: String,
    required: function() { return this.methodType === 'card'; },
    trim: true,
    uppercase: true
  },
  expiryDate: {
    type: String,
    required: function() { return this.methodType === 'card'; }
  },
  lastFourDigits: {
    type: String,
    required: function() { return this.methodType === 'card'; }
  },
  cardBrand: {
    type: String,
    enum: ['visa', 'mastercard', 'amex', 'discover', 'unknown'],
    default: 'unknown'
  },
  
  // Mobile money fields
  mobileProvider: {
    type: String,
    enum: ['mtn', 'airtel', 'vodafone', 'tigo', 'orange', null],
    default: null
  },
  mobileNumber: {
    type: String,
    required: function() { return this.methodType === 'mobile_money'; }
  },
  
  // Status fields
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Detect card brand and mask card number before saving
paymentMethodSchema.pre('save', function(next) {
  if (this.methodType === 'card' && this.cardNumber) {
    const cleanCardNumber = this.cardNumber.replace(/\s/g, '');
    
    // Store last 4 digits
    this.lastFourDigits = cleanCardNumber.slice(-4);
    
    // Detect card brand
    const firstDigit = cleanCardNumber[0];
    if (firstDigit === '4') this.cardBrand = 'visa';
    else if (firstDigit === '5') this.cardBrand = 'mastercard';
    else if (firstDigit === '3') this.cardBrand = 'amex';
    else if (firstDigit === '6') this.cardBrand = 'discover';
    else this.cardBrand = 'unknown';
    
    // Mask card number for storage
    this.cardNumber = `**** **** **** ${this.lastFourDigits}`;
  }
  next();
});

// Index for better query performance
paymentMethodSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);