import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    console.log("Fetching products...");
    const products = await Product.find();
    console.log("Products found:", products.length);
    res.json(products);
  } catch (err) {
    console.log("Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductsByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    console.log("Fetching products for farmer:", farmerId);
    const products = await Product.find({ farmer: farmerId });
    console.log("Farmer products found:", products.length);
    res.json(products);
  } catch (err) {
    console.log("Error fetching farmer products:", err);
    res.status(500).json({ error: err.message });
  }
};
