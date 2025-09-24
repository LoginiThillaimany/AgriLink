import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  userId: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
  }],
}, { timestamps: true });

export default model("Cart", cartSchema);