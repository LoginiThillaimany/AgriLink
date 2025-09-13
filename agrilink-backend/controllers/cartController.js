import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const USER_ID = '64a1b2c3d4e5f6g7h8i9j0k1'; // Mock user ID

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: USER_ID });
    if (!cart) {
      cart = new Cart({ userId: USER_ID, items: [] });
    }
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: USER_ID }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: USER_ID });
    if (cart) {
      const item = cart.items.find(item => item.productId.toString() === productId);
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        }
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.productId');
        res.json(populatedCart);
      } else {
        res.status(404).json({ error: 'Item not found in cart' });
      }
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: USER_ID });
    if (cart) {
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.productId');
      res.json(populatedCart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: USER_ID }, { items: [] });
    res.json({ items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};