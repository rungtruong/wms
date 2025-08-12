'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warrantyHistoryService } from '@/services/warranty-history';
import { WarrantyHistory, CreateWarrantyHistoryRequest, UpdateWarrantyHistoryRequest, ActionType } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Plus, Search, Edit, Trash2, History, FileText, Wrench, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const warrantyHistorySchema = z.object({
  serialId: z.string().min(1, 'Serial ID is required'),
  actionType: z.nativeEnum(ActionType),
  actionDate: z.string().min(1, 'Action date is required'),
  performedBy: z.string().min(1, 'Performed by is required'),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type WarrantyHistoryFormData = z.infer<typeof warrantyHistorySchema>;

export default function WarrantyHistoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHistory, setEditingHistory] = useState<WarrantyHistory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<ActionType | ''>('');
  const queryClient = useQueryClient();

  const { data: warrantyHistories = [], isLoading } = useQuery({
    queryKey: ['warranty-history', actionTypeFilter],
    queryFn: () => warrantyHistoryService.getAll(actionTypeFilter || undefined),
  });

  const createMutation = useMutation({
    mutationFn: warrantyHistoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warranty-history'] });
      setIsModalOpen(false);
      reset();
      toast.success('Warranty history created successfully');
    },
    onError: () => {
      toast.error('Failed to create warranty history');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarrantyHistoryRequest }) =>
      warrantyHistoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warranty-history'] });
      setIsModalOpen(false);
      setEditingHistory(null);
      reset();
      toast.success('Warranty history updated successfully');
    },
    onError: () => {
      toast.error('Failed to update warranty history');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: warrantyHistoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warranty-history'] });
      toast.success('Warranty history deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete warranty history');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarrantyHistoryFormData>({
    resolver: zodResolver(warrantyHistorySchema),
  });

  const onSubmit = (data: WarrantyHistoryFormData) => {
    const formattedData = {
      ...data,
      actionDate: new Date(data.actionDate).toISOString(),
    };

    if (editingHistory) {
      updateMutation.mutate({ id: editingHistory.id, data: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const handleEdit = (history: WarrantyHistory) => {
    setEditingHistory(history);
    reset({
      serialId: history.serialId,
      actionType: history.actionType,
      actionDate: new Date(history.actionDate).toISOString().split('T')[0],
      performedBy: history.performedBy,
      description: history.description || '',
      notes: history.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this warranty history entry?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredHistories = warrantyHistories.filter(
    (history) =>
      history.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.serial?.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (history.description && history.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getActionTypeColor = (actionType: ActionType) => {
    switch (actionType) {
      case ActionType.ACTIVATED:
        return 'bg-green-100 text-green-800';
      case ActionType.REPAIRED:
        return 'bg-yellow-100 text-yellow-800';
      case ActionType.REPLACED:
        return 'bg-blue-100 text-blue-800';
      case ActionType.VOIDED:
        return 'bg-red-100 text-red-800';
      case ActionType.CREATED:
        return 'bg-purple-100 text-purple-800';
      case ActionType.UPDATED:
        return 'bg-indigo-100 text-indigo-800';
      case ActionType.EXPIRED:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionTypeIcon = (actionType: ActionType) => {
    switch (actionType) {
      case ActionType.ACTIVATED:
      case ActionType.CREATED:
        return <Package className="h-4 w-4" />;
      case ActionType.REPAIRED:
        return <Wrench className="h-4 w-4" />;
      case ActionType.REPLACED:
        return <FileText className="h-4 w-4" />;
      case ActionType.VOIDED:
      case ActionType.EXPIRED:
        return <History className="h-4 w-4" />;
      case ActionType.UPDATED:
        return <Edit className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Warranty History</h1>
          <button
            onClick={() => {
              setEditingHistory(null);
              reset();
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add History Entry
          </button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search warranty history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={actionTypeFilter}
            onChange={(e) => setActionTypeFilter(e.target.value as ActionType | '')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Action Types</option>
            {Object.values(ActionType).map((actionType) => (
              <option key={actionType} value={actionType}>
                {actionType}
              </option>
            ))}
          </select>
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
                    Action Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistories.map((history) => (
                  <tr key={history.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {history.serial?.serialNumber || 'N/A'}
                        </div>
                        {history.serial?.product && (
                          <div className="text-sm text-gray-500">
                            {history.serial.product.name} - {history.serial.product.model}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getActionTypeIcon(history.actionType)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(history.actionType)}`}>
                          {history.actionType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(history.actionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {history.performedBy}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {history.description || '-'}
                      </div>
                      {history.notes && (
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          Notes: {history.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(history)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(history.id)}
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
                {editingHistory ? 'Edit Warranty History' : 'Add New Warranty History'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial ID
                  </label>
                  <input
                    {...register('serialId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.serialId && (
                    <p className="text-red-500 text-sm mt-1">{errors.serialId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Type
                  </label>
                  <select
                    {...register('actionType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {Object.values(ActionType).map((actionType) => (
                      <option key={actionType} value={actionType}>
                        {actionType}
                      </option>
                    ))}
                  </select>
                  {errors.actionType && (
                    <p className="text-red-500 text-sm mt-1">{errors.actionType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Date
                  </label>
                  <input
                    type="date"
                    {...register('actionDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.actionDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.actionDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Performed By
                  </label>
                  <input
                    {...register('performedBy')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.performedBy && (
                    <p className="text-red-500 text-sm mt-1">{errors.performedBy.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingHistory(null);
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
                      : editingHistory
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