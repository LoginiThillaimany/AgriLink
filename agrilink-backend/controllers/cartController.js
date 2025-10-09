import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    res.json(cart || { userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const upsertCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { items } = req.body;
    const updated = await Cart.findOneAndUpdate(
      { userId },
      { userId, items: items || [] },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndUpdate({ userId }, { items: [] }, { upsert: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


