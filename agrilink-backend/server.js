import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js"; 
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrilink';
mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// Health & readiness
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/ready', (req, res) => {
  const state = mongoose.connection.readyState; // 1 = connected
  res.json({ dbConnected: state === 1 });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
