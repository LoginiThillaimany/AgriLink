import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
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
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsSoldOut = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (!product.soldOut) {
      // Mark as sold out, create sale entry
      const quantitySold = product.quantity;
      const sale = new Sale({ productId: product._id, quantitySold });
      await sale.save();

      product.soldOut = true;
      product.sales += quantitySold;
      product.quantity = 0;
      await product.save();
    } else {
      // Unmark as sold out, perhaps reset quantity or something, but for simplicity, just toggle
      product.soldOut = false;
      await product.save();
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSalesPlot = async (req, res) => {
  try {
    const { filter = 'month' } = req.query; // day, week, month
    let groupBy;

    if (filter === 'day') {
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
    } else if (filter === 'week') {
      groupBy = { $dateToString: { format: "%Y-%U", date: "$date" } };
    } else {
      groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
    }

    const salesData = await Sale.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: { date: groupBy, product: '$product.name' },
          totalSold: { $sum: '$quantitySold' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json(salesData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
