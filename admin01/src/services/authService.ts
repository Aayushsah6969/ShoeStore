import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async adminLogin(credentials: LoginCredentials): Promise<{ success: boolean }> {
    try {
      const response = await api.post('/api/users/admin-login', credentials, {
        withCredentials: true, // send/receive cookies
      });

      return response.data; // { success: true }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async adminLogout(): Promise<void> {
    try {
      await api.get('/api/users/admin-logout', {
        withCredentials: true,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  async verifyAdminToken(): Promise<void> {
    // This is no longer used since you're checking cookie directly
    return;
  }
};
