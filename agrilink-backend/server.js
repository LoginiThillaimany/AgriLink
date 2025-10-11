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

<<<<<<< HEAD
// Middleware
=======
// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
>>>>>>> origin/thirishnaviP
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);

<<<<<<< HEAD
app.use("/api/v1/products", productRoutes);
=======
// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'AgriLink API is running!' });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});
>>>>>>> origin/thirishnaviP

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;