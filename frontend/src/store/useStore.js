import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { transformApiProduct, transformCartToOrderItems } from '../utils/dataTransform';

const defaultFilters = {
  search: '',
  priceRange: [0, 10000],
  brands: [],
  sizes: [],
  colors: [],
  sortBy: 'popularity'
};

export const useStore = create(
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
      
      login: async (data) => {
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
        } catch (error) {
          set({ authError: error.message, authLoading: false });
          throw error;
        }
      },

      signup: async (data) => {
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
        } catch (error) {
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
        } catch (error) {
          set({ productsError: error.message, productsLoading: false });
        }
      },

      getProductById: async (id) => {
        try {
          const apiProduct = await productService.getProductById(id);
          return transformApiProduct(apiProduct);
        } catch (error) {
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
            total: parseFloat(order.total_price),
            status: order.delivery_status || order.status || 'pending',
            items: order.order_items.map(item => ({
              id: item.product_id + '-' + (item.size || '') + '-' + (item.price_at_purchase || ''),
              product: {
                id: item.product_id,
                name: item.product_name || 'Unknown Product',
                image: item.image || '',
                brand: '',
                price: parseFloat(item.price_at_purchase),
                originalPrice: undefined,
                images: [item.image || ''],
                description: '',
                category: '',
                sizes: [item.size],
                colors: [],
                inStock: true,
                featured: false,
                onSale: false,
                rating: 0,
                reviews: 0,
                stock_quantity: 0 // required by Product interface
              },
              quantity: item.quantity,
              selectedSize: item.size,
              selectedColor: ''
            }))
          }));
          set({ orders, ordersLoading: false });
        } catch (error) {
          set({ ordersError: error.message, ordersLoading: false });
        }
      },

      createOrder: async (orderData) => {
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
            status: apiOrder.status,
            items: cart
          };
          
          set({ orders: [...get().orders, order] });
          return apiOrder;
        } catch (error) {
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