// src/api/productAPI.js
import api from './axios';

const API_BASE = '/api/products';

const productAPI = {
  // Product CRUD operations
  getAllProducts: () => api.get(API_BASE),
  getProduct: (id) => api.get(`${API_BASE}/${id}`),
  getSellerProducts: () => api.get(`${API_BASE}/my-products`),
  createProduct: (data) => api.post(API_BASE, data),
  updateProduct: (id, data) => api.put(`${API_BASE}/${id}`, data),
  deleteProduct: (id) => api.delete(`${API_BASE}/${id}`),
  
  // Product categories
  getProductsByCategory: (category) => api.get(`${API_BASE}/category/${category}`),
  searchProducts: (query) => api.get(`${API_BASE}/search?query=${encodeURIComponent(query)}`),
  
  // Shopping features
  addToCart: (productId) => api.post(`/api/cart/add/${productId}`),
  addToWishlist: (productId) => api.post(`/api/wishlist/add/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/api/wishlist/remove/${productId}`),
  getWishlist: () => api.get('/api/wishlist'),
};

export default productAPI;
