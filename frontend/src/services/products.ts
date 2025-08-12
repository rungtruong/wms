import { api } from '@/lib/api';
import { Product, CreateProductRequest, UpdateProductRequest } from '@/types';

export const productsService = {
  getAll: async (model?: string): Promise<Product[]> => {
    const params = model ? { model } : {};
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData: CreateProductRequest): Promise<Product> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id: string, productData: UpdateProductRequest): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};