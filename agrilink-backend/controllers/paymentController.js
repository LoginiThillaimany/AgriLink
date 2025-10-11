const PaymentMethod = require('../models/PaymentMethod');
const Transaction = require('../models/Transaction');

// Add payment method
const addPaymentMethod = async (req, res) => {
  try {
    const { methodType, cardNumber, cardHolderName, expiryDate, mobileNumber, mobileProvider } = req.body;
    const userId = req.user._id;

    // Check if user already has this payment method
    const existingMethod = await PaymentMethod.findOne({
      user: userId,
      methodType,
      ...(methodType === 'card' ? { lastFourDigits: cardNumber.slice(-4) } : { mobileNumber })
    });

    if (existingMethod) {
      return res.status(400).json({
        status: 'error',
        message: 'This payment method already exists'
      });
    }

    // If this is the first payment method, set as default
    const userMethodsCount = await PaymentMethod.countDocuments({ user: userId });
    const isDefault = userMethodsCount === 0;

    const paymentMethod = new PaymentMethod({
      user: userId,
      methodType,
      cardNumber,
      cardHolderName,
      expiryDate,
      mobileNumber,
      mobileProvider,
      isDefault
    });

    await paymentMethod.save();

    // Create a test transaction record
    const transaction = new Transaction({
      user: userId,
      paymentMethod: paymentMethod._id,
      amount: 0, // Test transaction with zero amount
      status: 'completed',
      transactionType: 'payment',
      description: 'Payment method verification',
      metadata: {
        action: 'payment_method_added',
        methodType: methodType
      }
    });

    await transaction.save();

    res.status(201).json({
      status: 'success',
      message: 'Payment method added successfully',
      data: {
        paymentMethod: {
          _id: paymentMethod._id,
          methodType: paymentMethod.methodType,
          lastFourDigits: paymentMethod.lastFourDigits,
          cardHolderName: paymentMethod.cardHolderName,
          cardBrand: paymentMethod.cardBrand,
          mobileNumber: paymentMethod.mobileNumber,
          mobileProvider: paymentMethod.mobileProvider,
          isDefault: paymentMethod.isDefault,
          createdAt: paymentMethod.createdAt
        },
        transaction: {
          reference: transaction.reference,
          status: transaction.status,
          createdAt: transaction.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding payment method'
    });
  }
};

// Get user's payment methods
const getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user._id;

    const paymentMethods = await PaymentMethod.find({ 
      user: userId, 
      isActive: true 
    }).select('-cardNumber -__v').sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        paymentMethods,
        count: paymentMethods.length
      }
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching payment methods'
    });
  }
};

// Set default payment method
const setDefaultPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const userId = req.user._id;

    // Reset all user's payment methods to non-default
    await PaymentMethod.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );

    // Set the selected method as default
    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: paymentMethodId, user: userId },
      { $set: { isDefault: true } },
      { new: true }
    ).select('-cardNumber -__v');

    if (!paymentMethod) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment method not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Default payment method updated successfully',
      data: { paymentMethod }
    });

  } catch (error) {
    console.error('Set default payment method error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating default payment method'
    });
  }
};

// Delete payment method
const deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const userId = req.user._id;

    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: paymentMethodId, user: userId },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!paymentMethod) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment method not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment method deleted successfully'
    });

  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting payment method'
    });
  }
};

module.exports = {
  addPaymentMethod,
  getPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod
};