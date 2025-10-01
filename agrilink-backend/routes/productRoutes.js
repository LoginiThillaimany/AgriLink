import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleSoldOut,
  getSalesAnalytics
} from "../controllers/productController.js";
import {
  validateProduct,
  validateId,
  handleValidationErrors
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Product routes
router.get("/", getProducts);
router.get("/:id", validateId, handleValidationErrors, getProduct);
router.post("/", validateProduct, handleValidationErrors, createProduct);
router.put("/:id", validateId, validateProduct, handleValidationErrors, updateProduct);
router.delete("/:id", validateId, handleValidationErrors, deleteProduct);

// Special operations
router.patch("/:id/toggle-soldout", validateId, handleValidationErrors, toggleSoldOut);

// Analytics
router.get("/analytics/sales", getSalesAnalytics);

export default router;
