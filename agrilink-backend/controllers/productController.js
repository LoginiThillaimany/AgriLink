const PaymentMethod = require('../models/PaymentMethod');
const Transaction = require('../models/Transaction');

// Add payment method
const addPaymentMethod = async (req, res) => {
  try {
    const { methodType, cardNumber, cardHolderName, expiryDate, mobileNumber, mobileProvider } = req.body;
    const userId = req.user._id;

    console.log('🔄 Adding payment method for user:', userId);
    console.log('📦 Payment method type:', methodType);

    // Check if user already has this payment method
    let existingMethod;
    if (methodType === 'card') {
      const lastFourDigits = cardNumber.replace(/\s/g, '').slice(-4);
      existingMethod = await PaymentMethod.findOne({
        user: userId,
        methodType: 'card',
        lastFourDigits: lastFourDigits
      });
    } else {
      existingMethod = await PaymentMethod.findOne({
        user: userId,
        methodType: 'mobile_money',
        mobileNumber: mobileNumber
      });
    }

    if (existingMethod) {
      console.log('❌ Payment method already exists');
      return res.status(400).json({
        status: 'error',
        message: 'This payment method already exists'
      });
    }

    // If this is the first payment method, set as default
    const userMethodsCount = await PaymentMethod.countDocuments({ 
      user: userId, 
      isActive: true 
    });
    const isDefault = userMethodsCount === 0;

    console.log('📊 Creating new payment method, isDefault:', isDefault);

    const paymentMethodData = {
      user: userId,
      methodType,
      isDefault
    };

    if (methodType === 'card') {
      paymentMethodData.cardNumber = cardNumber;
      paymentMethodData.cardHolderName = cardHolderName.toUpperCase();
      paymentMethodData.expiryDate = expiryDate;
    } else {
      paymentMethodData.mobileNumber = mobileNumber;
      paymentMethodData.mobileProvider = mobileProvider;
    }

    const paymentMethod = new PaymentMethod(paymentMethodData);
    await paymentMethod.save();

    console.log('✅ Payment method saved to DB:', {
      id: paymentMethod._id,
      methodType: paymentMethod.methodType,
      lastFourDigits: paymentMethod.lastFourDigits,
      cardBrand: paymentMethod.cardBrand
    });

    // Create a verification transaction record
    const transaction = new Transaction({
      user: userId,
      paymentMethod: paymentMethod._id,
      amount: 0,
      status: 'completed',
      transactionType: 'verification',
      description: 'Payment method verification and setup',
      metadata: {
        action: 'payment_method_added',
        methodType: methodType
      }
    });

    await transaction.save();
    console.log('✅ Transaction record created:', transaction.reference);

    res.status(201).json({
      status: 'success',
      message: 'Payment method added successfully',
      data: {
        paymentMethod: {
          _id: paymentMethod._id,
          methodType: paymentMethod.methodType,
          cardHolderName: paymentMethod.cardHolderName,
          lastFourDigits: paymentMethod.lastFourDigits,
          cardBrand: paymentMethod.cardBrand,
          expiryDate: paymentMethod.expiryDate,
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
    console.error('💥 Add payment method error:', error);
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
    })
    .select('-__v')
    .sort({ isDefault: -1, createdAt: -1 });

    console.log(`📋 Found ${paymentMethods.length} payment methods for user ${userId}`);

    res.status(200).json({
      status: 'success',
      data: {
        paymentMethods,
        count: paymentMethods.length
      }
    });

  } catch (error) {
    console.error('💥 Get payment methods error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching payment methods'
    });
  }
};

module.exports = {
  addPaymentMethod,
  getPaymentMethods
};