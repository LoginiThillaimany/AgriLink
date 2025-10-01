import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: {
      values: ['Vegetables', 'Fruits', 'Grains', 'Others'],
      message: 'Category must be one of: Vegetables, Fruits, Grains, Others'
    }
  },
  variety: { 
    type: String,
    trim: true,
    maxlength: [50, 'Variety cannot exceed 50 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  unit: { 
    type: String, 
    required: [true, 'Unit is required'],
    trim: true
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer'
    }
  },
  minOrder: { 
    type: Number, 
    default: 1,
    min: [1, 'Minimum order must be at least 1']
  },
  image: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || v.startsWith('data:image/') || v.startsWith('http');
      },
      message: 'Invalid image format'
    }
  },
  harvestDate: { 
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v <= new Date();
      },
      message: 'Harvest date cannot be in the future'
    }
  },
  bestByDate: { 
    type: Date,
    validate: {
      validator: function(v) {
        return !v || !this.harvestDate || v >= this.harvestDate;
      },
      message: 'Best by date must be after harvest date'
    }
  },
  deliveryOptions: [{
    type: String,
    enum: ['Farm pickup', 'Local delivery', "Farmer's market"]
  }],
  soldOut: { 
    type: Boolean, 
    default: false 
  },
  sales: { 
    type: Number, 
    default: 0,
    min: [0, 'Sales cannot be negative']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ soldOut: 1 });
productSchema.index({ isDeleted: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.soldOut) return 'sold_out';
  if (this.quantity === 0) return 'out_of_stock';
  if (this.quantity < 5) return 'low_stock';
  return 'in_stock';
});

// Virtual for days until best by
productSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.bestByDate) return null;
  const today = new Date();
  const diffTime = this.bestByDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  if (this.quantity === 0) {
    this.soldOut = true;
  }
  next();
});

// Query middleware to exclude deleted products by default
productSchema.pre(/^find/, function(next) {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;