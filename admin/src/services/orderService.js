import api from './api';

export const orderService = {
  async getAllOrders() {
    try {
      const response = await api.get('/api/orders/getAllOrders');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  async updateOrderStatus(id, statusData) {
    try {
      const response = await api.put(`/api/orders/update/${id}`, statusData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  async getOrderById(id) {
    try {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
};