// src/api/productAPI.js
import api from './axios';

const API_BASE = '/api/products';

const productAPI = {
  getSellerProducts: () => api.get(`${API_BASE}/my-products`),
  deleteProduct: (id) => api.delete(`${API_BASE}/${id}`),
  createProduct: (data) => api.post(API_BASE, data),
  updateProduct: (id, data) => api.put(`${API_BASE}/${id}`, data),
  getAllProducts: () => api.get(`${API_BASE}`),
  addToCart: (productId) => api.post(`/api/cart/add/${productId}`),
  addToWishlist: (productId) => api.post(`/api/wishlist/add/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/api/wishlist/remove/${productId}`),
  getWishlist: () => api.get('/api/wishlist'),
};

export default productAPI;
