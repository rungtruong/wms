import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('statistics')
  async getStatistics() {
    return this.dashboardService.getStatistics();
  }

  @Get('charts/warranty-requests')
  async getWarrantyRequestsChart() {
    return this.dashboardService.getWarrantyRequestsChart();
  }

  @Get('charts/product-failures')
  async getProductFailuresChart() {
    return this.dashboardService.getProductFailuresChart();
  }
}