import express from "express";
import { createOrder, getOrders, updateOrderStatus, cancelOrder, reorder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/status", updateOrderStatus);
router.delete("/:orderId/cancel", cancelOrder);
router.post("/:orderId/reorder", reorder);

export default router;