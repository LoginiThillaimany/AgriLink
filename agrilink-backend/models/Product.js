// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  variety: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  minOrder: { type: Number, default: 1 },
  image: { type: String },
  harvestDate: { type: Date },
  bestByDate: { type: Date },
  deliveryOptions: [String],
  soldOut: { type: Boolean, default: false },
  sales: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);

export default Product; 
