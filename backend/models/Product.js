const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: {
    type: [String], // Changed from single image to array of images
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  color: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema); 