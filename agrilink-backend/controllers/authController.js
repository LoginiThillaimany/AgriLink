const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password, userType } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email or phone number'
      });
    }
    
    // Create new user
    const newUser = await User.create({
      fullName,
      phoneNumber,
      email,
      password,
      userType
    });
    
    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    
    // 1) Check if phoneNumber and password exist
    if (!phoneNumber || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide phone number and password'
      });
    }
    
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ phoneNumber }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect phone number or password'
      });
    }
    
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Protect middleware (for future use)
exports.protect = async (req, res, next) => {
  // This would be implemented later for protecting routes
  next();
};