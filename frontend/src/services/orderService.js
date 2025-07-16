import api from './api';

export const orderService = {
  // Create order
  async createOrder(data) {
    try {
      const response = await api.post('/api/orders/create', data);
      return response.data.order || response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  // Get my orders
  async getMyOrders() {
    try {
      const response = await api.get('/api/orders/my-orders');
      return response.data.orders || response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Cancel order
  async cancelOrder(orderId) {
    try {
      await api.delete(`/api/orders/cancel/${orderId}`);
    } catch (error) {
      console.error(`Failed to cancel order ${orderId}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  }
};