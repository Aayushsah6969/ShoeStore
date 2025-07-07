import api from './api';

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export const authService = {
  // Signup
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/users/signup', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/users/login', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.get('/api/users/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if logout fails on server, we should clear local state
    }
  },

  // Check if user is authenticated (optional - for session validation)
  async checkAuth(): Promise<AuthResponse | null> {
    try {
      const response = await api.get('/api/users/me'); // Assuming this endpoint exists
      return response.data;
    } catch (error) {
      return null;
    }
  }
};