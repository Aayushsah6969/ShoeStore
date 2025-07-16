import api from './api';

export const authService = {
  // Signup
  async signup(data) {
    try {
      const response = await api.post('/api/users/signup', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  // Login
  async login(data) {
    try {
      const response = await api.post('/api/users/login', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Logout
  async logout() {
    try {
      await api.get('/api/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, we should clear local state
    }
  },

  // Check if user is authenticated (optional - for session validation)
  async checkAuth() {
    try {
      const response = await api.get('/api/users/me'); // Assuming this endpoint exists
      return response.data;
    } catch (error) {
      return null;
    }
  }
};