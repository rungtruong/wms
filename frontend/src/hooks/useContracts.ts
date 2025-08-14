import { useState, useEffect } from 'react';
import { contractsService } from '@/lib/services/contracts';
import type { Contract } from '@/types';
import { showToast } from '@/lib/toast';

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractsService.getAll();
      setContracts(data);
    } catch (err) {
      const errorMessage = 'Lỗi khi tải danh sách hợp đồng';
      setError(errorMessage);
      showToast.error(errorMessage);
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const refetch = () => {
    fetchContracts();
  };

  return {
    contracts,
    loading,
    error,
    refetch,
  };
}

export function useContract(id: string) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContract = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractsService.getById(id);
      setContract(data);
    } catch (err) {
      const errorMessage = 'Lỗi khi tải thông tin hợp đồng';
      setError(errorMessage);
      showToast.error(errorMessage);
      console.error('Error fetching contract:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchContract();
    }
  }, [id]);

  const refetch = () => {
    fetchContract();
  };

  return {
    contract,
    loading,
    error,
    refetch,
  };
}