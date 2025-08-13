export class DashboardStatisticsDto {
  totalContracts: number;
  activeContracts: number;
  expiredContracts: number;
  expiringThisMonth: number;
  totalSerials: number;
  pendingRequests: number;
  processingRequests: number;
  completedRequests: number;
  monthlyRevenue: number;
  topFailingProducts: TopFailingProductDto[];
}

export class TopFailingProductDto {
  name: string;
  failures: number;
}