// models/Sale.js
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantitySold: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;  