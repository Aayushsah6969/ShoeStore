import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, User, Order, FilterState } from '../types';
import { authService, SignupData, LoginData } from '../services/authService';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { transformApiProduct, transformCartToOrderItems } from '../utils/dataTransform';

interface StoreState {
  // Cart state
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // User state
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;

  // Products state
  products: any[];
  productsLoading: boolean;
  productsError: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<any>;

  // Orders state
  orders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: any) => Promise<any>;
  addOrder: (order: Order) => void;

  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const defaultFilters: FilterState = {
  search: '',
  priceRange: [0, 300],
  brands: [],
  sizes: [],
  colors: [],
  sortBy: 'popularity'
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      addToCart: (item) => {
        const existingItem = get().cart.find(
          (cartItem) => 
            cartItem.product.id === item.product.id && 
            cartItem.selectedSize === item.selectedSize && 
            cartItem.selectedColor === item.selectedColor
        );

        if (existingItem) {
          set({
            cart: get().cart.map((cartItem) =>
              cartItem.id === existingItem.id
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            )
          });
        } else {
          set({
            cart: [...get().cart, { ...item, id: Date.now().toString() }]
          });
        }
      },
      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity === 0) {
          get().removeFromCart(id);
        } else {
          set({
            cart: get().cart.map((item) =>
              item.id === id ? { ...item, quantity } : item
            )
          });
        }
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },
      getCartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      // User state
      user: null,
      isAuthenticated: false,
      authLoading: false,
      authError: null,
      
      login: async (data: LoginData) => {
        set({ authLoading: true, authError: null });
        try {
          const response = await authService.login(data);
          if (response.success) {
            if (response.user) {
              set({ 
                user: {
                  id: response.user.id || '',
                  name: response.user.full_name,
                  email: response.user.email
                }, 
                isAuthenticated: true,
                authLoading: false 
              });
            } else {
              set({ isAuthenticated: true, authLoading: false });
            }
            return;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error: any) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      signup: async (data: SignupData) => {
        set({ authLoading: true, authError: null });
        try {
          const response = await authService.signup(data);
          if (response.success) {
            if (response.user) {
              set({ 
                user: {
                  id: response.user.id || '',
                  name: response.user.full_name,
                  email: response.user.email
                }, 
                isAuthenticated: true,
                authLoading: false 
              });
            } else {
              set({ authLoading: false });
            }
            return;
          } else {
            throw new Error(response.message || 'Signup failed');
          }
        } catch (error: any) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false,
            orders: [],
            cart: [] // Clear cart on logout
          });
        }
      },

      clearAuthError: () => set({ authError: null }),

      // Products state
      products: [],
      productsLoading: false,
      productsError: null,

      fetchProducts: async () => {
        set({ productsLoading: true, productsError: null });
        try {
          const apiProducts = await productService.getAllProducts();
          const products = apiProducts.map(transformApiProduct);
          set({ products, productsLoading: false });
        } catch (error: any) {
          set({ productsError: error.message, productsLoading: false });
        }
      },

      getProductById: async (id: string) => {
        try {
          const apiProduct = await productService.getProductById(id);
          return transformApiProduct(apiProduct);
        } catch (error: any) {
          console.error('Failed to fetch product:', error);
          throw error;
        }
      },

      // Orders state
      orders: [],
      ordersLoading: false,
      ordersError: null,

      fetchOrders: async () => {
        if (!get().isAuthenticated) return;
        
        set({ ordersLoading: true, ordersError: null });
        try {
          const apiOrders = await orderService.getMyOrders();
          const orders = apiOrders.map(order => ({
            id: order.id,
            date: order.created_at,
            total: order.total_amount,
            status: order.status as any,
            items: order.order_items.map(item => ({
              id: item.id,
              product: {
                id: item.product?.id || item.product_id,
                name: item.product?.name || 'Unknown Product',
                image: item.product?.image || '',
                brand: item.product?.brand || '',
                price: item.price,
                // Add other required product fields with defaults
                originalPrice: undefined,
                images: [item.product?.image || ''],
                description: '',
                category: '',
                sizes: [item.size],
                colors: [item.color || ''],
                inStock: true,
                featured: false,
                onSale: false,
                rating: 0,
                reviews: 0
              },
              quantity: item.quantity,
              selectedSize: item.size,
              selectedColor: item.color || ''
            }))
          }));
          set({ orders, ordersLoading: false });
        } catch (error: any) {
          set({ ordersError: error.message, ordersLoading: false });
        }
      },

      createOrder: async (orderData: any) => {
        try {
          const cart = get().cart;
          const orderItems = transformCartToOrderItems(cart);
          
          const apiOrder = await orderService.createOrder({
            order_items: orderItems,
            shipping_address: orderData.shipping_address,
            payment_info: orderData.payment_info
          });
          
          // Add to local orders
          const order = {
            id: apiOrder.id,
            date: apiOrder.created_at,
            total: apiOrder.total_amount,
            status: apiOrder.status as any,
            items: cart
          };
          
          set({ orders: [...get().orders, order] });
          return apiOrder;
        } catch (error: any) {
          console.error('Failed to create order:', error);
          throw error;
        }
      },

      addOrder: (order) => set({ orders: [...get().orders, order] }),

      // Filters
      filters: defaultFilters,
      setFilters: (newFilters) => set({ filters: { ...get().filters, ...newFilters } }),
      resetFilters: () => set({ filters: defaultFilters }),

      // Wishlist
      wishlist: [],
      addToWishlist: (productId) => {
        if (!get().wishlist.includes(productId)) {
          set({ wishlist: [...get().wishlist, productId] });
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter((id) => id !== productId) });
      },
      isInWishlist: (productId) => get().wishlist.includes(productId)
    }),
    {
      name: 'shoe-store',
      partialize: (state) => ({
        // Only persist certain parts of the state
        cart: state.cart,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        wishlist: state.wishlist,
        filters: state.filters
      })
    }
  )
);