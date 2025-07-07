import api from './api';

export interface Order {
  id: string;
  user_id: string;
  customer_name?: string;
  customer_email?: string;
  total_amount: number;
  delivery_status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size?: string;
}

export interface UpdateOrderStatusData {
  delivery_status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/api/orders/getAllOrders');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  async updateOrderStatus(id: string, statusData: UpdateOrderStatusData): Promise<Order> {
    try {
      const response = await api.put(`/api/orders/update/${id}`, statusData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
};