import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authService.adminLogin({ email, password });
          if (res.success) {
            set({ isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ isAuthenticated: false, isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isAuthenticated: false, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          await authService.adminLogout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ isAuthenticated: false });
        }
      },

      verifyAuth: () => {
        set({ isLoading: true });

        const hasToken = document.cookie
          .split(';')
          .some((c) => c.trim().startsWith('admin_token='));

        set({
          isAuthenticated: hasToken,
          isLoading: false
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);