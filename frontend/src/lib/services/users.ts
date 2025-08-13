import { apiClient } from '../api';
import type { User } from '@/types';

interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'manager' | 'technician';
}

interface UpdateUserRequest {
  email?: string;
  fullName?: string;
  role?: 'admin' | 'manager' | 'technician';
  isActive?: boolean;
}

class UsersService {
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  }

  async getById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }

  async create(data: CreateUserRequest): Promise<User> {
    return apiClient.post<User>('/users', data);
  }

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    return apiClient.patch<User>(`/users/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`);
  }

  async getTechnicians(): Promise<User[]> {
    const users = await this.getAll();
    return users.filter(user => user.role === 'technician' && user.isActive);
  }

  async getManagers(): Promise<User[]> {
    const users = await this.getAll();
    return users.filter(user => user.role === 'manager' && user.isActive);
  }

  async getActiveUsers(): Promise<User[]> {
    const users = await this.getAll();
    return users.filter(user => user.isActive);
  }
}

export const usersService = new UsersService();
export type { CreateUserRequest, UpdateUserRequest };