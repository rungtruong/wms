import { api } from '@/lib/api';
import { LoginRequest, LoginResponse } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};