import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { TicketStatus, ActionType } from '@prisma/client';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class CustomerPortalService {
  constructor(
    private prisma: PrismaService,
    private ticketsService: TicketsService
  ) {}

  async getCustomerOverview(customerEmail: string) {
    const contracts = await this.prisma.contract.findMany({
      where: {
        customerEmail: customerEmail,
      },
      include: {
        contractProducts: true,
        productSerials: {
          include: {
            tickets: {
              where: {
                status: {
                  in: [TicketStatus.received, TicketStatus.in_progress],
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (contracts.length === 0) {
      throw new NotFoundException(`No contracts found for customer email ${customerEmail}`);
    }

    const totalSerials = contracts.reduce((sum, contract) => sum + contract.productSerials.length, 0);
    const activeTickets = contracts.reduce(
      (sum, contract) => sum + contract.productSerials.reduce(
        (serialSum, productSerial) => serialSum + productSerial.tickets.length, 0
      ), 0
    );

    const activeContracts = contracts.filter(contract => contract.status === 'active').length;
    const expiredContracts = contracts.filter(contract => contract.status === 'expired').length;

    return {
      customer: {
        name: contracts[0].customerName,
        email: contracts[0].customerEmail,
        phone: contracts[0].customerPhone,
        address: contracts[0].customerAddress,
      },
      summary: {
        totalContracts: contracts.length,
        activeContracts,
        expiredContracts,
        totalSerials,
        activeTickets,
      },
      recentContracts: contracts.slice(0, 5).map(contract => ({
        id: contract.id,
        contractNumber: contract.contractNumber,
        startDate: contract.startDate,
        endDate: contract.endDate,
        status: contract.status,
        productCount: contract.contractProducts.length,
      })),
    };
  }

  async getWarrantyHistory(customerEmail: string) {
    const warrantyHistory = await this.prisma.warrantyHistory.findMany({
      where: {
        productSerial: {
          contract: {
            customerEmail: customerEmail,
          },
        },
      },
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
      },
      orderBy: {
        performedAt: 'desc',
      },
    });

    return warrantyHistory.map(history => ({
      id: history.id,
      serialNumber: history.productSerial.serialNumber,
      productName: history.productSerial.name,
      actionType: history.actionType,
      description: history.description,
      performedAt: history.performedAt,
      performedBy: history.performedBy,
      contractNumber: history.productSerial.contract.contractNumber,
    }));
  }

  async createSupportRequest(createSupportRequestDto: CreateSupportRequestDto) {
    const createTicketDto = {
      serialNumber: createSupportRequestDto.serialNumber,
      issueDescription: `${createSupportRequestDto.subject}: ${createSupportRequestDto.message}`,
      issueTitle: createSupportRequestDto.subject,
      priority: createSupportRequestDto.priority || 'medium',
      customerName: createSupportRequestDto.customerName,
      customerEmail: createSupportRequestDto.customerEmail,
      customerPhone: createSupportRequestDto.customerPhone,
    };

    const ticket = await this.ticketsService.create(createTicketDto);

    return {
      success: true,
      message: 'Support request created successfully',
      ticket,
    };
  }
}