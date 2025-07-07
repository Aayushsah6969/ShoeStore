import { create } from 'zustand';
import { productService, Product } from '../services/productService';
import { orderService, Order } from '../services/orderService';

interface DataState {
  // Products
  products: Product[];
  productsLoading: boolean;
  
  // Orders
  orders: Order[];
  ordersLoading: boolean;
  
  // Categories (derived from products)
  categories: string[];
  
  // Actions
  fetchProducts: () => Promise<void>;
  addProduct: (productData: any) => Promise<void>;
  updateProduct: (id: string, updates: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initial state
  products: [],
  productsLoading: false,
  orders: [],
  ordersLoading: false,
  categories: [],
  
  // Product actions
  fetchProducts: async () => {
    set({ productsLoading: true });
    try {
      const products = await productService.getAllProducts();
      const categories = [...new Set(products.map(p => p.category))];
      set({ products, categories, productsLoading: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ productsLoading: false });
      throw error;
    }
  },
  
  addProduct: async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData);
      const { products } = get();
      const updatedProducts = [...products, newProduct];
      const categories = [...new Set(updatedProducts.map(p => p.category))];
      set({ products: updatedProducts, categories });
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  },
  
  updateProduct: async (id, updates) => {
    try {
      const updatedProduct = await productService.updateProduct(id, updates);
      const { products } = get();
      const updatedProducts = products.map(p => p.id === id ? updatedProduct : p);
      const categories = [...new Set(updatedProducts.map(p => p.category))];
      set({ products: updatedProducts, categories });
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      await productService.deleteProduct(id);
      const { products } = get();
      const updatedProducts = products.filter(p => p.id !== id);
      const categories = [...new Set(updatedProducts.map(p => p.category))];
      set({ products: updatedProducts, categories });
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },
  
  // Order actions
  fetchOrders: async () => {
    set({ ordersLoading: true });
    try {
      const orders = await orderService.getAllOrders();
      set({ orders, ordersLoading: false });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      set({ ordersLoading: false });
      throw error;
    }
  },
  
  updateOrderStatus: async (id, status) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, { delivery_status: status as any });
      const { orders } = get();
      const updatedOrders = orders.map(o => o.id === id ? updatedOrder : o);
      set({ orders: updatedOrders });
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }
}));