import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
}

export const authService = {
  async adminLogin(credentials: LoginCredentials): Promise<AdminUser> {
    try {
      const response = await api.post('/api/users/admin-login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async adminLogout(): Promise<void> {
    try {
      await api.get('/api/users/admin-logout');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  async verifyAdminToken(): Promise<AdminUser | null> {
    try {
      const response = await api.get('/api/users/verify-admin');
      return response.data;
    } catch (error) {
      return null;
    }
  }
};