const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Validation middleware
const validateProduct = (req, res, next) => {
  const { name, price, category, description, images } = req.body;
  
  if (!name || !price || !category || !description || !images?.length) {
    return res.status(400).json({ 
      message: "Please provide all required fields: name, price, category, description, and at least one image" 
    });
  }

  if (price < 0) {
    return res.status(400).json({ message: "Price cannot be negative" });
  }

  next();
};

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product
router.post("/", validateProduct, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      images: req.body.images,
      specs: req.body.specs || [],
      color: req.body.color || [],
      features: req.body.features || [],
      brand: req.body.brand
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put("/:id", validateProduct, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        images: req.body.images,
        specs: req.body.specs || [],
        color: req.body.color || [],
        features: req.body.features || [],
        brand: req.body.brand
      },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
