import { body, param, query, validationResult } from "express-validator";

export const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Vegetables", "Fruits", "Grains", "Others"])
    .withMessage("Category must be one of: Vegetables, Fruits, Grains, Others"),

  body("variety")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Variety cannot exceed 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("unit")
    .trim()
    .notEmpty()
    .withMessage("Unit is required")
    .isLength({ max: 20 })
    .withMessage("Unit cannot exceed 20 characters"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  body("minOrder")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Minimum order must be at least 1"),

  body("image")
    .optional()
    .custom((value) => {
      if (!value) return true;
      return value.startsWith("data:image/") || value.startsWith("http");
    })
    .withMessage("Image must be a valid base64 string or URL"),

  body("harvestDate")
    .optional()
    .isISO8601()
    .withMessage("Harvest date must be a valid ISO date")
    .custom((value, { req }) => {
      if (value && new Date(value) > new Date()) {
        throw new Error("Harvest date cannot be in the future");
      }
      return true;
    }),

  body("bestByDate")
    .optional()
    .isISO8601()
    .withMessage("Best by date must be a valid ISO date")
    .custom((value, { req }) => {
      if (value && req.body.harvestDate && new Date(value) <= new Date(req.body.harvestDate)) {
        throw new Error("Best by date must be after harvest date");
      }
      return true;
    }),

  body("deliveryOptions")
    .optional()
    .isArray()
    .withMessage("Delivery options must be an array")
    .custom((value) => {
      if (!value || value.length === 0) return true;
      const validOptions = ["Farm pickup", "Local delivery", "Farmer's market"];
      return value.every((opt) => validOptions.includes(opt));
    })
    .withMessage("Invalid delivery options"),
];

export const validateId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID format"),
];

export const validateSalesAnalytics = [
  query("filter")
    .optional()
    .isIn(["day", "week", "month"])
    .withMessage("Filter must be one of: day, week, month"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  next();
};

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ip: req.ip,
    };

    console.log(`📡 ${log.method} ${log.url} - ${log.status} - ${log.duration}`);
  });

  next();
};

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error("Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message).join(", ");
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};