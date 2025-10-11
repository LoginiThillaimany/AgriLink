const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Route files
const auth = require('./routes/auth');
const payment = require('./routes/payment'); // Payment routes

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting - Stricter for payment endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  }
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Stricter limit for payment endpoints
  message: {
    status: 'error',
    message: 'Too many payment requests. Please try again later.'
  }
});

app.use(generalLimiter);
app.use('/api/v1/payments', paymentLimiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/payments', payment);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AgriLink API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/v1/auth',
      payments: '/api/v1/payments',
      health: '/api/health'
    }
  });
});

// Health check route with DB status
app.get('/api/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const healthInfo = {
      status: 'success',
      message: 'AgriLink Backend is running successfully',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus[dbState] || 'unknown',
        readyState: dbState
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage()
      }
    };

    // If DB is connected, show collection counts
    if (dbState === 1) {
      const User = require('./models/User');
      const PaymentMethod = require('./models/PaymentMethod');
      const Transaction = require('./models/Transaction');
      
      try {
        const userCount = await User.countDocuments();
        const paymentMethodCount = await PaymentMethod.countDocuments();
        const transactionCount = await Transaction.countDocuments();
        
        healthInfo.database.collections = {
          users: userCount,
          paymentMethods: paymentMethodCount,
          transactions: transactionCount
        };
      } catch (dbError) {
        healthInfo.database.collections = 'Unable to fetch collection counts';
      }
    }

    res.status(200).json(healthInfo);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Database info route (for debugging)
app.get('/api/debug/db-info', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    const collectionInfo = [];
    
    for (let coll of collections) {
      const count = await mongoose.connection.collection(coll.name).countDocuments();
      collectionInfo.push({
        name: coll.name,
        count: count
      });
    }
    
    res.json({
      status: 'success',
      database: mongoose.connection.name,
      collections: collectionInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get database info',
      error: error.message
    });
  }
});

// Handle undefined routes
app.all('*', (req, res) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
    suggestedEndpoints: [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/payments/methods',
      '/api/health'
    ]
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: messages
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 'error',
      message: `${field} already exists. Please use a different ${field}.`
    });
  }

  // Mongoose ObjectId error
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format provided.'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid authentication token.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication token has expired. Please login again.'
    });
  }

  // Rate limit error
  if (err.statusCode === 429) {
    return res.status(429).json({
      status: 'error',
      message: 'Too many requests. Please try again later.'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const response = {
    status: 'error',
    message: err.message || 'Internal Server Error'
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = {
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    };
  }

  res.status(statusCode).json(response);
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed.');
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 AgriLink Server Started!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📅 Started at: ${new Date().toISOString()}
🔗 Health Check: http://localhost:${PORT}/api/health
📊 DB Info: http://localhost:${PORT}/api/debug/db-info

📋 Available Endpoints:
   🔐 Auth: http://localhost:${PORT}/api/v1/auth
   💳 Payments: http://localhost:${PORT}/api/v1/payments
   ❤️ Health: http://localhost:${PORT}/api/health
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('🚨 Unhandled Promise Rejection:', err.message);
  console.log(err.stack);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('🚨 Uncaught Exception:', err.message);
  console.log(err.stack);
  process.exit(1);
});

module.exports = app;