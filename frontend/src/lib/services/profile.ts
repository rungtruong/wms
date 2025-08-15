import { apiClient } from '../api';
import type { User } from '@/types';

interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class ProfileService {
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return apiClient.patch<User>('/auth/profile', data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return apiClient.patch<void>('/auth/change-password', data);
  }
}

export const profileService = new ProfileService();
export type { UpdateProfileRequest, ChangePasswordRequest };