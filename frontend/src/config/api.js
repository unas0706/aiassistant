const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const endpoints = {
  base: API_URL,
  products: `${API_URL}/api/products`,
  product: (id) => `${API_URL}/api/products/${id}`,
  chat: `${API_URL}/api/chat/chat`,
  login: `${API_URL}/api/auth/login`
};

// Add this for debugging
console.log('API Configuration:', {
  API_URL,
  endpoints
});

export default API_URL; 