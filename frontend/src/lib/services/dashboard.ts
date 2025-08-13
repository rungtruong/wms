import { apiClient } from '../api';
import type { Statistics } from '@/types';

interface DashboardStatistics {
  totalContracts: number;
  activeContracts: number;
  expiredContracts: number;
  expiringThisMonth: number;
  totalSerials: number;
  pendingRequests: number;
  processingRequests: number;
  completedRequests: number;
  monthlyRevenue: number;
  topFailingProducts: Array<{
    name: string;
    failures: number;
  }>;
}

interface WarrantyRequestsChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

interface ProductFailuresChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string[];
  }>;
}

class DashboardService {
  async getStatistics(): Promise<DashboardStatistics> {
    return apiClient.get<DashboardStatistics>('/dashboard/statistics');
  }

  async getWarrantyRequestsChart(): Promise<WarrantyRequestsChartData> {
    return apiClient.get<WarrantyRequestsChartData>('/dashboard/charts/warranty-requests');
  }

  async getProductFailuresChart(): Promise<ProductFailuresChartData> {
    return apiClient.get<ProductFailuresChartData>('/dashboard/charts/product-failures');
  }
}

export const dashboardService = new DashboardService();
export type {
  DashboardStatistics,
  WarrantyRequestsChartData,
  ProductFailuresChartData
};