const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  specs: [{
    type: String
  }],
  color: [{
    type: String
  }],
  features: [{
    type: String
  }],
  brand: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 