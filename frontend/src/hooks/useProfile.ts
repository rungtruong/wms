import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService, type UpdateProfileRequest, type ChangePasswordRequest } from '@/lib/services/profile';
import { showToast } from '@/lib/toast';
import type { User } from '@/types';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(['profile'], updatedUser);
      showToast.success('Cập nhật thông tin thành công!');
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      showToast.error('Có lỗi xảy ra khi cập nhật thông tin!');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
    onSuccess: () => {
      showToast.success('Đổi mật khẩu thành công!');
    },
    onError: (error: any) => {
      console.error('Password change error:', error);
      const message = error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu!';
      showToast.error(message);
    },
  });
}