import { Schema, model } from "mongoose";

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String },
  weightKg: { type: Number },
  image: { type: String },
}, { _id: false });

const cartSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
}, { timestamps: true });

export default model('Cart', cartSchema);


