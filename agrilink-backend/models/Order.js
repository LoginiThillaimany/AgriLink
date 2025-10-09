import { Schema, model } from "mongoose";

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String },
  weightKg: { type: Number },
  image: { type: String },
});

const orderSchema = new Schema({
  userId: { type: String, required: true },
  items: { type: [orderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: { type: String },
  notes: { type: String },
}, { timestamps: true });

export default model('Order', orderSchema);


