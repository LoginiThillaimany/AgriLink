import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: "Other" },
  description: { type: String },
  image: { type: String },
  inStock: { type: Boolean, default: true },
  unit: { type: String, default: "per kg" },
  weightKg: { type: Number, default: 1 },
  rating: { type: Number, default: 4.5 },
  dateAdded: { type: Date, default: Date.now },
  farmer: { type: String }
}, { timestamps: true });

export default model("Product", productSchema);
