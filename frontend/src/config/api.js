const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const endpoints = {
  products: `${API_URL}/api/products`,
};

export default API_URL; 