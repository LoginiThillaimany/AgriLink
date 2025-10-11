const express = require('express');
const router = express.Router();
const {
  addPaymentMethod,
  getPaymentMethods
} = require('../controllers/paymentController');
const { validatePaymentMethod } = require('../middleware/validation');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

router.post('/methods', validatePaymentMethod, addPaymentMethod);
router.get('/methods', getPaymentMethods);

// Debug route to see all payment data (remove in production)
router.get('/debug/all-data', auth, async (req, res) => {
  try {
    const PaymentMethod = require('../models/PaymentMethod');
    const Transaction = require('../models/Transaction');
    
    const paymentMethods = await PaymentMethod.find({}).populate('user', 'fullName email phoneNumber');
    const transactions = await Transaction.find({}).populate('user', 'fullName email').populate('paymentMethod');
    
    res.json({
      status: 'success',
      data: {
        paymentMethods,
        transactions,
        counts: {
          paymentMethods: paymentMethods.length,
          transactions: transactions.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

module.exports = router;