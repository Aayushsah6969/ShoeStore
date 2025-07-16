import api from './api';

export const authService = {
  async adminLogin(credentials) {
    try {
      const response = await api.post('/api/users/admin-login', credentials, {
        withCredentials: true, // send/receive cookies
      });

      return response.data; // { success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async adminLogout() {
    try {
      await api.get('/api/users/admin-logout', {
        withCredentials: true,
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  async verifyAdminToken() {
    // This is no longer used since you're checking cookie directly
    return;
  }
};