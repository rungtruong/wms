'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { productsService } from '@/services/products';
import { Product, CreateProductRequest } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  model: z.string().min(1, 'Model là bắt buộc'),
  description: z.string().optional(),
  category: z.string().min(1, 'Danh mục là bắt buộc'),
  warrantyMonths: z.number().min(1, 'Thời gian bảo hành phải lớn hơn 0'),
  price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
});

type ProductForm = z.infer<typeof productSchema>;

function ProductModal({ 
  isOpen, 
  onClose, 
  product 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  product?: Product;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!product;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      model: product.model,
      description: product.description || '',
      category: product.category,
      warrantyMonths: product.warrantyMonths,
      price: product.price,
    } : undefined,
  });

  const createMutation = useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Tạo sản phẩm thành công!');
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductRequest> }) =>
      productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Cập nhật sản phẩm thành công!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const onSubmit = (data: ProductForm) => {
    if (isEdit && product) {
      updateMutation.mutate({ id: product.id, data });
    } else {
      createMutation.mutate(data as CreateProductRequest);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
              <input
                {...register('name')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <input
                {...register('model')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Danh mục</label>
              <input
                {...register('category')}
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Thời gian bảo hành (tháng)</label>
              <input
                {...register('warrantyMonths', { valueAsNumber: true })}
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.warrantyMonths && <p className="text-red-500 text-sm">{errors.warrantyMonths.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá</label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: productsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Xóa sản phẩm thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="mt-2 text-sm text-gray-700">
            Danh sách tất cả sản phẩm trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bảo hành
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Hành động</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Đang tải...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Không có sản phẩm nào
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-gray-500">{product.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.warrantyMonths} tháng
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={editingProduct}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <ProductsContent />
    </DashboardLayout>
  );
}