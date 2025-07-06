import { create } from 'zustand';
import { AUTH_ENDPOINTS, ApiResponse } from '../config/api.config';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: null | { email: string; full_name?: string };
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (full_name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const getUserFromCookie = () => {
  const token = getCookie('shoe_token');
  if (token) {
    // Try to get user email from localStorage
    const email = localStorage.getItem('shoe_user_email');
    if (email) return { email };
    return { email: 'user@example.com' };
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => {
  const checkAuth = () => {
    const token = getCookie('shoe_token');
    const user = getUserFromCookie();
    set({ isAuthenticated: !!token, user: !!token ? user : null });
  };

  // Call checkAuth on store creation
  checkAuth();

  return {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data: ApiResponse = await res.json();
        if (data.success) {
          const token = getCookie('shoe_token');
          if (token) localStorage.setItem('shoe_user_email', email);
          set({ isAuthenticated: !!token, user: { email }, loading: false, error: null });
          return true;
        } else {
          set({ error: data.message || 'Login failed', loading: false });
          return false;
        }
      } catch (err) {
        set({ error: 'Network error', loading: false });
        return false;
      }
    },

    signup: async (full_name, email, password) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch(AUTH_ENDPOINTS.SIGNUP, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name, email, password })
        });
        const data: ApiResponse = await res.json();
        if (data.success) {
          localStorage.setItem('shoe_user_email', email);
          set({ loading: false, error: null });
          return true;
        } else {
          set({ error: data.message || 'Signup failed', loading: false });
          return false;
        }
      } catch (err) {
        set({ error: 'Network error', loading: false });
        return false;
      }
    },

    logout: () => {
      set({ isAuthenticated: false, user: null });
      document.cookie = 'shoe_token=; Max-Age=0; path=/;';
      localStorage.removeItem('shoe_user_email');
    },

    checkAuth,
  };
});
