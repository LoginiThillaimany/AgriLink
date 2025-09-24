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
  image: { type: String },
  harvestDate: { type: Date },
  bestByDate: { type: Date },
  deliveryOptions: [String],
});

const Product = mongoose.model("Product", productSchema);

export default Product; 
