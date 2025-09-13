import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const USER_ID = '64a1b2c3d4e5f6g7h8i9j0k1'; // Mock user ID

export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: USER_ID }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const newOrder = new Order({
      userId: USER_ID,
      items: orderItems,
      total,
    });

    const savedOrder = await newOrder.save();

    // Clear cart
    await Cart.findOneAndUpdate({ userId: USER_ID }, { items: [] });

    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: USER_ID }).populate('items.productId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);
    if (order.userId.toString() !== USER_ID) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (order.userId.toString() !== USER_ID) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (order.status === 'Delivered') {
      return res.status(400).json({ error: 'Cannot cancel delivered order' });
    }
    order.status = 'Cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const reorder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('items.productId');
    if (order.userId.toString() !== USER_ID) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const cart = await Cart.findOne({ userId: USER_ID });
    if (cart) {
      order.items.forEach(orderItem => {
        const existing = cart.items.find(item => item.productId.toString() === orderItem.productId._id.toString());
        if (existing) {
          existing.quantity += orderItem.quantity;
        } else {
          cart.items.push({
            productId: orderItem.productId._id,
            quantity: orderItem.quantity,
          });
        }
      });
      await cart.save();
    } else {
      const newCart = new Cart({
        userId: USER_ID,
        items: order.items.map(orderItem => ({
          productId: orderItem.productId._id,
          quantity: orderItem.quantity,
        })),
      });
      await newCart.save();
    }

    res.json({ message: 'Items added to cart for reorder' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};