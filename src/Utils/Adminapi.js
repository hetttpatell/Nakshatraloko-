// api/adminApi.js
import api from './api';

export const adminApi = {
  // Categories
  createCategory: (categoryData) => api.post('/admin/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/admin/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Products
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Orders
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}`, { status }),
};

export default adminApi;