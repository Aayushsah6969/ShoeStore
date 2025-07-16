import api from './api';

export const productService = {
  // Get all products
  async getAllProducts() {
    try {
      const response = await api.get('/api/products/getall');
      return response.data.products || response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  // Get product by ID
  async getProductById(id) {
    try {
      const response = await api.get(`/api/products/getall/${id}`);
      return response.data.product || response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }
};