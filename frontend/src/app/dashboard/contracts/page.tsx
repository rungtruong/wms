'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsService } from '@/services/contracts';
import { Contract, CreateContractRequest, UpdateContractRequest, ContractStatus } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const contractSchema = z.object({
  contractNumber: z.string().min(1, 'Contract number is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
  signedDate: z.string().min(1, 'Signed date is required'),
  status: z.nativeEnum(ContractStatus),
  notes: z.string().optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

export default function ContractsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: contractsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setIsModalOpen(false);
      reset();
      toast.success('Contract created successfully');
    },
    onError: () => {
      toast.error('Failed to create contract');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContractRequest }) =>
      contractsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setIsModalOpen(false);
      setEditingContract(null);
      reset();
      toast.success('Contract updated successfully');
    },
    onError: () => {
      toast.error('Failed to update contract');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: contractsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete contract');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
  });

  const onSubmit = (data: ContractFormData) => {
    if (editingContract) {
      updateMutation.mutate({ id: editingContract.id, data });
    } else {
      const createData: CreateContractRequest = {
        ...data,
        products: [] // Empty products array for now
      };
      createMutation.mutate(createData);
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    reset({
      contractNumber: contract.contractNumber,
      customerName: contract.customerName,
      customerEmail: contract.customerEmail,
      customerPhone: contract.customerPhone || '',
      customerAddress: contract.customerAddress || '',
      signedDate: contract.signedDate.toString().split('T')[0],
      status: contract.status,
      notes: contract.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case ContractStatus.EXPIRED:
        return 'bg-red-100 text-red-800';
      case ContractStatus.CANCELLED:
        return 'bg-yellow-100 text-yellow-800';
      case ContractStatus.DRAFT:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
          <button
            onClick={() => {
              setEditingContract(null);
              reset();
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Contract
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.contractNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contract.customerName}</div>
                        <div className="text-sm text-gray-500">{contract.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(contract.signedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(contract)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contract.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingContract ? 'Edit Contract' : 'Add New Contract'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Number
                  </label>
                  <input
                    {...register('contractNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.contractNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.contractNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    {...register('customerName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    {...register('customerEmail')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone
                  </label>
                  <input
                    {...register('customerPhone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Address
                  </label>
                  <textarea
                    {...register('customerAddress')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Signed Date
                  </label>
                  <input
                    type="date"
                    {...register('signedDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.signedDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.signedDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {Object.values(ContractStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingContract(null);
                      reset();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingContract
                      ? 'Update'
                      : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}