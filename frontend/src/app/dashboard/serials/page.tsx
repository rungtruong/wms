'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serialsService } from '@/services/serials';
import { productsService } from '@/services/products';
import { contractsService } from '@/services/contracts';
import { Serial, CreateSerialRequest, UpdateSerialRequest, WarrantyStatus } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Plus, Search, Edit, Trash2, Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const serialSchema = z.object({
  serialNumber: z.string().min(1, 'Serial number is required'),
  productId: z.string().min(1, 'Product is required'),
  contractId: z.string().min(1, 'Contract is required'),
  warrantyStartDate: z.string().min(1, 'Warranty start date is required'),
  warrantyEndDate: z.string().min(1, 'Warranty end date is required'),
  warrantyStatus: z.nativeEnum(WarrantyStatus),
  notes: z.string().optional(),
});

type SerialFormData = z.infer<typeof serialSchema>;

export default function SerialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSerial, setEditingSerial] = useState<Serial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: serials = [], isLoading } = useQuery({
    queryKey: ['serials'],
    queryFn: serialsService.getAll,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getAll(),
  });

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: serialsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serials'] });
      setIsModalOpen(false);
      reset();
      toast.success('Serial created successfully');
    },
    onError: () => {
      toast.error('Failed to create serial');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSerialRequest }) =>
      serialsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serials'] });
      setIsModalOpen(false);
      setEditingSerial(null);
      reset();
      toast.success('Serial updated successfully');
    },
    onError: () => {
      toast.error('Failed to update serial');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: serialsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serials'] });
      toast.success('Serial deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete serial');
    },
  });

  const updateWarrantyStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: WarrantyStatus }) =>
      serialsService.updateWarrantyStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serials'] });
      toast.success('Warranty status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update warranty status');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SerialFormData>({
    resolver: zodResolver(serialSchema),
  });

  const onSubmit = (data: SerialFormData) => {
    if (editingSerial) {
      updateMutation.mutate({ id: editingSerial.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (serial: Serial) => {
    setEditingSerial(serial);
    reset({
      serialNumber: serial.serialNumber,
      productId: serial.productId,
      contractId: serial.contractId,
      warrantyStartDate: serial.warrantyStartDate.toString().split('T')[0],
      warrantyEndDate: serial.warrantyEndDate.toString().split('T')[0],
      warrantyStatus: serial.warrantyStatus,
      notes: serial.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this serial?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleWarrantyStatusChange = (id: string, status: WarrantyStatus) => {
    updateWarrantyStatusMutation.mutate({ id, status });
  };

  const filteredSerials = serials.filter(
    (serial) =>
      serial.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serial.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serial.product?.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWarrantyStatusColor = (status: WarrantyStatus) => {
    switch (status) {
      case WarrantyStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case WarrantyStatus.EXPIRED:
        return 'bg-red-100 text-red-800';
      case WarrantyStatus.VOIDED:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWarrantyStatusIcon = (status: WarrantyStatus) => {
    switch (status) {
      case WarrantyStatus.ACTIVE:
        return <ShieldCheck className="h-4 w-4 text-green-600" />;
      case WarrantyStatus.EXPIRED:
        return <ShieldX className="h-4 w-4 text-red-600" />;
      case WarrantyStatus.VOIDED:
        return <Shield className="h-4 w-4 text-yellow-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Serial Numbers</h1>
          <button
            onClick={() => {
              setEditingSerial(null);
              reset();
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Serial
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search serials..."
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
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warranty
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
                {filteredSerials.map((serial) => {
                  const remainingDays = getRemainingDays(serial.warrantyEndDate.toString());
                  return (
                    <tr key={serial.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {serial.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{serial.product?.name}</div>
                          <div className="text-sm text-gray-500">{serial.product?.model}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {serial.contract?.contractNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(serial.warrantyStartDate).toLocaleDateString()} - {new Date(serial.warrantyEndDate).toLocaleDateString()}
                        </div>
                        {serial.warrantyStatus === WarrantyStatus.ACTIVE && remainingDays > 0 && (
                          <div className="text-xs text-gray-500">
                            {remainingDays} days remaining
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getWarrantyStatusIcon(serial.warrantyStatus)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getWarrantyStatusColor(serial.warrantyStatus)}`}>
                            {serial.warrantyStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(serial)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <select
                            value={serial.warrantyStatus}
                            onChange={(e) => handleWarrantyStatusChange(serial.id, e.target.value as WarrantyStatus)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            {Object.values(WarrantyStatus).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleDelete(serial.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingSerial ? 'Edit Serial' : 'Add New Serial'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>
                  <input
                    {...register('serialNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.serialNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.serialNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <select
                    {...register('productId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.model}
                      </option>
                    ))}
                  </select>
                  {errors.productId && (
                    <p className="text-red-500 text-sm mt-1">{errors.productId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract
                  </label>
                  <select
                    {...register('contractId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a contract</option>
                    {contracts.map((contract) => (
                      <option key={contract.id} value={contract.id}>
                        {contract.contractNumber} - {contract.customerName}
                      </option>
                    ))}
                  </select>
                  {errors.contractId && (
                    <p className="text-red-500 text-sm mt-1">{errors.contractId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty Start
                    </label>
                    <input
                      type="date"
                      {...register('warrantyStartDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {errors.warrantyStartDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.warrantyStartDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty End
                    </label>
                    <input
                      type="date"
                      {...register('warrantyEndDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {errors.warrantyEndDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.warrantyEndDate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warranty Status
                  </label>
                  <select
                    {...register('warrantyStatus')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {Object.values(WarrantyStatus).map((status) => (
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
                      setEditingSerial(null);
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
                      : editingSerial
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