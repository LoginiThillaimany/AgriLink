import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    quantitySold: {
      type: Number,
      required: [true, "Quantity sold is required"],
      min: [1, "Quantity sold must be at least 1"],
    },
    salePrice: {
      type: Number,
      required: [true, "Sale price is required"],
      min: [0, "Sale price must be a positive number"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

saleSchema.index({ date: -1 });
saleSchema.index({ productId: 1 });

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;