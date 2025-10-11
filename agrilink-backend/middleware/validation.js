const validatePaymentMethod = (req, res, next) => {
  const { methodType, cardNumber, cardHolderName, expiryDate, mobileNumber, mobileProvider } = req.body;

  if (!methodType) {
    return res.status(400).json({
      status: 'error',
      message: 'Payment method type is required'
    });
  }

  if (methodType === 'card') {
    if (!cardNumber || !cardHolderName || !expiryDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Card number, holder name, and expiry date are required for card payments'
      });
    }

    // Basic card validation
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid card number. Must be 16 digits.'
      });
    }

    // Expiry date validation
    const [month, year] = expiryDate.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid expiry date format. Use MM/YY.'
      });
    }
  }

  if (methodType === 'mobile_money') {
    if (!mobileNumber || !mobileProvider) {
      return res.status(400).json({
        status: 'error',
        message: 'Mobile number and provider are required for mobile money payments'
      });
    }
  }

  next();
};

module.exports = {
  validatePaymentMethod
};