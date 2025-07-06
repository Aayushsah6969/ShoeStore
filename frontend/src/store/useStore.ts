import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, User, Order, FilterState } from '../types';

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
  login: (user: User) => void;
  logout: () => void;

  // Orders
  orders: Order[];
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
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Orders
      orders: [],
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
      name: 'shoe-store'
    }
  )
);