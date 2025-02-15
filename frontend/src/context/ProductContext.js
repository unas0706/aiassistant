import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { endpoints } from '../config/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(endpoints.products);
      console.log('Fetched products:', response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get a single product by ID
  const getProductById = (id) => {
    return products.find(product => product._id === id);
  };

  const value = {
    products,
    loading,
    error,
    getProductById,
    refreshProducts: fetchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 