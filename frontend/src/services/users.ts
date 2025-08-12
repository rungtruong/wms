import { api } from '@/lib/api';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types';

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  update: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};