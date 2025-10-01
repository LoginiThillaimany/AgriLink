import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import { asyncHandler } from "../middleware/validationMiddleware.js";

// Get all products with pagination
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  let query = { isDeleted: false };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

// Get single product
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || product.isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// Create product
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    variety,
    description,
    price,
    unit,
    quantity,
    minOrder,
    image,
    harvestDate,
    bestByDate,
    deliveryOptions,
  } = req.body;

  const productData = {
    name,
    category,
    variety,
    description,
    price: parseFloat(price),
    unit,
    quantity: parseInt(quantity),
    minOrder: parseInt(minOrder) || 1,
    image,
    harvestDate: harvestDate ? new Date(harvestDate) : undefined,
    bestByDate: bestByDate ? new Date(bestByDate) : undefined,
    deliveryOptions: Array.isArray(deliveryOptions) ? deliveryOptions : [],
  };

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// Update product
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    variety,
    description,
    price,
    unit,
    quantity,
    minOrder,
    image,
    harvestDate,
    bestByDate,
    deliveryOptions,
  } = req.body;

  const productData = {
    name,
    category,
    variety,
    description,
    price: parseFloat(price),
    unit,
    quantity: parseInt(quantity),
    minOrder: parseInt(minOrder) || 1,
    image,
    harvestDate: harvestDate ? new Date(harvestDate) : undefined,
    bestByDate: bestByDate ? new Date(bestByDate) : undefined,
    deliveryOptions: Array.isArray(deliveryOptions) ? deliveryOptions : [],
  };

  const product = await Product.findByIdAndUpdate(req.params.id, productData, {
    new: true,
    runValidators: true,
  });

  if (!product || product.isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// Delete product (soft delete)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Toggle sold out
export const toggleSoldOut = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || product.isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (!product.soldOut && product.quantity > 0) {
    const sale = new Sale({
      productId: product._id,
      quantitySold: product.quantity,
      salePrice: product.price,
    });
    await sale.save();

    product.soldOut = true;
    product.sales += product.quantity;
    product.quantity = 0;
  } else {
    product.soldOut = false;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: `Product ${product.soldOut ? "marked as sold out" : "restocked"}`,
    data: product,
  });
});

// Get sales analytics
export const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { filter = "month" } = req.query;

  let groupBy;
  switch (filter) {
    case "day":
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
      break;
    case "week":
      groupBy = { $dateToString: { format: "%Y-%U", date: "$date" } };
      break;
    default:
      groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
  }

  const salesData = await Sale.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: {
          date: groupBy,
          product: "$product.name",
        },
        totalSold: { $sum: "$quantitySold" },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: salesData,
  });
});