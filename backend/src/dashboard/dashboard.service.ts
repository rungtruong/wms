import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus, ContractStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics() {
    const [totalContracts, activeContracts, expiredContracts, totalSerials, tickets] = await Promise.all([
      this.prisma.contract.count(),
      this.prisma.contract.count({ where: { status: ContractStatus.active } }),
      this.prisma.contract.count({ where: { status: ContractStatus.expired } }),
      this.prisma.productSerial.count(),
      this.prisma.ticket.findMany({ select: { status: true } })
    ]);

    const expiringThisMonth = await this.prisma.contract.count({
      where: {
        endDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        },
        status: ContractStatus.active
      }
    });

    const pendingRequests = tickets.filter(t => t.status === null).length;
    const processingRequests = tickets.filter(t => t.status === TicketStatus.in_progress).length;
    const completedRequests = tickets.filter(t => t.status === TicketStatus.resolved).length;

    const topFailingProducts = await this.getTopFailingProducts();

    return {
      totalContracts,
      activeContracts,
      expiredContracts,
      expiringThisMonth,
      totalSerials,
      pendingRequests,
      processingRequests,
      completedRequests,
      monthlyRevenue: 0,
      topFailingProducts
    };
  }

  async getWarrantyRequestsChart() {
    const tickets = await this.prisma.ticket.findMany({ select: { status: true } });
    
    const pendingRequests = tickets.filter(t => t.status === null).length;
    const processingRequests = tickets.filter(t => t.status === TicketStatus.in_progress).length;
    const completedRequests = tickets.filter(t => t.status === TicketStatus.resolved).length;

    return {
      pendingRequests,
      processingRequests,
      completedRequests
    };
  }

  async getProductFailuresChart() {
    const productFailures = await this.prisma.ticket.groupBy({
      by: ['productSerialId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    const productData = await Promise.all(
      productFailures.map(async (failure) => {
        const productSerial = await this.prisma.productSerial.findUnique({
          where: { id: failure.productSerialId }
        });
        return {
          name: productSerial?.name || 'Unknown',
          failures: failure._count.id
        };
      })
    );

    return productData;
  }

  private async getTopFailingProducts() {
    const productFailures = await this.prisma.ticket.groupBy({
      by: ['productSerialId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    const topFailingProducts = await Promise.all(
      productFailures.map(async (failure) => {
        const productSerial = await this.prisma.productSerial.findUnique({
          where: { id: failure.productSerialId }
        });
        return {
          name: productSerial?.name || 'Unknown',
          failures: failure._count.id
        };
      })
    );

    return topFailingProducts;
  }
}