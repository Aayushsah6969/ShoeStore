import api from './api';

export const productService = {
  async getAllProducts() {
    try {
      const response = await api.get('/api/products/getall');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/api/products/upload', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/api/products/update/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  async deleteProduct(id) {
    try {
      await api.delete(`/api/products/delete/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  }
};