import express from "express";
import { createOrder, getOrdersByUser, getOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);
router.get('/:id', getOrder);

export default router;


