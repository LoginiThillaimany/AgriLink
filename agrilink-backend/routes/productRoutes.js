import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct, markAsSoldOut, getSalesPlot } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", async (req, res) => {
  try {
    const product = await (await import("../models/Product.js")).default.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/soldout", markAsSoldOut);
router.get("/sales/plot", getSalesPlot);

export default router;
