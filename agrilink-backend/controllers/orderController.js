import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


