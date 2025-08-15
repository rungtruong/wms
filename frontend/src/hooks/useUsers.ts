import { useState, useEffect } from 'react';
import { usersService } from '@/lib/services/users';
import type { User, UpdateUserRequest } from '@/types';
import { showToast } from '@/lib/toast';

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await usersService.getById(id);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin người dùng');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const refetch = async () => {
    if (id) {
      try {
        setLoading(true);
        setError(null);
        const userData = await usersService.getById(id);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    }
  };

  return { user, loading, error, refetch };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (id: string, data: UpdateUserRequest): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await usersService.update(id, data);
      showToast.success('Cập nhật người dùng thành công!');
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể cập nhật người dùng';
      setError(errorMessage);
      showToast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await usersService.delete(id);
      showToast.success('Xóa người dùng thành công!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể xóa người dùng';
      setError(errorMessage);
      showToast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const usersData = await usersService.getAll();
        setUsers(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await usersService.getAll();
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch };
}