import api from './api';

export interface OrderItem {
  product_id: string;
  quantity: number;
  size: string;
  color?: string;
}

export interface CreateOrderData {
  order_items: OrderItem[];
  shipping_address?: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
  };
  payment_info?: {
    card_number: string;
    expiry_date: string;
    cvv: string;
    card_name: string;
  };
}

export interface ApiOrder {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    size: string;
    color?: string;
    price: number;
    product?: {
      id: string;
      name: string;
      image: string;
      brand: string;
    };
  }>;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order?: ApiOrder;
}

export interface OrdersResponse {
  success: boolean;
  orders: ApiOrder[];
}

export const orderService = {
  // Create order
  async createOrder(data: CreateOrderData): Promise<ApiOrder> {
    try {
      const response = await api.post('/api/orders/create', data);
      return response.data.order || response.data;
    } catch (error: any) {
      console.error('Failed to create order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  // Get my orders
  async getMyOrders(): Promise<ApiOrder[]> {
    try {
      const response = await api.get('/api/orders/my-orders');
      return response.data.orders || response.data;
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<void> {
    try {
      await api.delete(`/api/orders/cancel/${orderId}`);
    } catch (error: any) {
      console.error(`Failed to cancel order ${orderId}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  }
};