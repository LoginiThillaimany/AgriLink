const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Route files
const auth = require('./routes/auth');

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Debug all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl}`);
  next();
});

// Mount routers
app.use('/api/v1/auth', auth);

// Debug route registration
app._router.stack.forEach((middleware) => {
  if (middleware.name === 'router') {
    console.log(`✅ Routes mounted at: ${middleware.regexp}`);
  }
});

// Test route
app.get('/api/v1/auth/test', (req, res) => {
  res.json({ message: 'Auth route test - WORKING!' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'AgriLink API is running!' });
});

// Handle undefined routes
app.all('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Test auth route: http://localhost:${PORT}/api/v1/auth/test`);
});

module.exports = app;



// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // Load env vars
// dotenv.config();

// // Connect to database
// const connectDB = require('./config/database');
// connectDB();

// // Route files
// const auth = require('./routes/auth');

// const app = express();

// // Body parser middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Enable CORS
// app.use(cors());

// // Mount routers
// app.use('/api/v1/auth', auth);

// // Basic route
// app.get('/', (req, res) => {
//   res.json({ message: 'AgriLink API is running!' });
// });

// // Handle undefined routes
// app.all('*', (req, res) => {
//   res.status(404).json({
//     status: 'error',
//     message: `Can't find ${req.originalUrl} on this server!`
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;