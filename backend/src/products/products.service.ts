import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductSerialDto } from './dto/create-product-serial.dto';
import { UpdateProductSerialDto } from './dto/update-product-serial.dto';
import { CreateWarrantyRequestDto } from './dto/create-warranty-request.dto';
import { WarrantyStatus, TicketStatus, TicketPriority, ActionType } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductSerialDto: CreateProductSerialDto) {
    return this.prisma.productSerial.create({
      data: {
        serialNumber: createProductSerialDto.serialNumber || `SN-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        name: createProductSerialDto.name,
        model: createProductSerialDto.model,
        category: createProductSerialDto.category,
        description: createProductSerialDto.description,
        warrantyMonths: createProductSerialDto.warrantyMonths || 12,
        isActive: createProductSerialDto.isActive !== undefined ? createProductSerialDto.isActive : true,
      },
    });
  }

  async findAll() {
    return this.prisma.productSerial.findMany({
      include: {
        contract: true,
        contractProducts: {
          include: {
            contract: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const productSerial = await this.prisma.productSerial.findUnique({
      where: { id },
      include: {
        contract: true,
        contractProducts: {
          include: {
            contract: true,
          },
        },
        tickets: {
          include: {
            history: {
          include: {
            performer: true,
          },
        },
          },
        },
        warrantyHistory: {
          orderBy: {
            performedAt: 'desc',
          },
        },
      },
    });

    if (!productSerial) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return productSerial;
  }

  async findByModel(model: string) {
    return this.prisma.productSerial.findMany({
      where: {
        model: {
          contains: model,
          mode: 'insensitive',
        },
      },
    });
  }

  async update(id: string, updateProductSerialDto: UpdateProductSerialDto) {
    await this.findById(id);
    
    return this.prisma.productSerial.update({
      where: { id },
      data: updateProductSerialDto,
    });
  }

  async remove(id: string) {
    await this.findById(id);
    
    return this.prisma.productSerial.delete({
      where: { id },
    });
  }

  // Serial methods
  async createSerial(createProductSerialDto: CreateProductSerialDto) {
    // Check if serial number already exists
    const existingSerial = await this.prisma.productSerial.findUnique({
      where: { serialNumber: createProductSerialDto.serialNumber },
    });

    if (existingSerial) {
      throw new BadRequestException(`Serial number ${createProductSerialDto.serialNumber} already exists`);
    }

    // Check if contract exists if contractId is provided
    if (createProductSerialDto.contractId) {
      const contract = await this.prisma.contract.findUnique({
        where: { id: createProductSerialDto.contractId },
      });
      if (!contract) {
        throw new BadRequestException(`Contract with ID ${createProductSerialDto.contractId} not found`);
      }
    }

    const productSerial = await this.prisma.productSerial.create({
      data: {
        serialNumber: createProductSerialDto.serialNumber,
        name: createProductSerialDto.name,
        model: createProductSerialDto.model,
        category: createProductSerialDto.category,
        contractId: createProductSerialDto.contractId || null,
        manufactureDate: createProductSerialDto.manufactureDate ? new Date(createProductSerialDto.manufactureDate) : null,
        purchaseDate: createProductSerialDto.purchaseDate ? new Date(createProductSerialDto.purchaseDate) : null,
        warrantyStatus: createProductSerialDto.warrantyStatus || 'valid',
        notes: createProductSerialDto.notes,
      },
      include: {
        contract: true,
      },
    });

    return this.formatProductSerial(productSerial);
  }

  async findAllSerials() {
    const productSerials = await this.prisma.productSerial.findMany({
      include: {
        contract: true,
        warrantyHistory: {
          orderBy: {
            performedAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return productSerials.map(productSerial => this.formatProductSerial(productSerial));
  }

  async findSerialById(id: string) {
    const productSerial = await this.prisma.productSerial.findUnique({
      where: { id },
      include: {
        contract: true,
        tickets: {
          include: {
            history: {
          include: {
            performer: true,
          },
        },
          },
        },
        warrantyHistory: {
          orderBy: {
            performedAt: 'desc',
          },
        },
      },
    });

    if (!productSerial) {
      throw new NotFoundException(`Product Serial with ID ${id} not found`);
    }

    return this.formatProductSerial(productSerial);
  }

  async findBySerialNumber(serialNumber: string) {
    const productSerial = await this.prisma.productSerial.findUnique({
      where: { serialNumber },
      include: {
        contract: true,
        tickets: {
          include: {
            history: {
              include: {
                performer: true,
              },
            },
          },
        },
        warrantyHistory: true,
      },
    });

    if (!productSerial) {
      throw new NotFoundException(`Serial number ${serialNumber} not found`);
    }

    return productSerial;
  }

  async findSerialsByCustomerEmail(customerEmail: string) {
    return this.prisma.productSerial.findMany({
      where: {
        contract: {
          customerEmail: customerEmail,
        },
      },
      include: {
        contract: true,
        tickets: {
          include: {
            history: {
              include: {
                performer: true,
              },
            },
          },
        },
        warrantyHistory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getWarrantyDetails(serialNumber: string) {
    const productSerial = await this.prisma.productSerial.findUnique({
      where: { serialNumber },
      include: {
        contract: {
          include: {
            contractProducts: true,
          },
        },
        tickets: {
          include: {
            history: {
              include: {
                performer: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        warrantyHistory: {
          orderBy: {
            performedAt: 'desc',
          },
        },
      },
    });

    if (!productSerial) {
      throw new NotFoundException(`Serial number ${serialNumber} not found`);
    }

    const now = new Date();
    const warrantyEndDate = productSerial.purchaseDate 
      ? new Date(productSerial.purchaseDate.getTime() + (productSerial.warrantyMonths * 30 * 24 * 60 * 60 * 1000)) 
      : null;
    
    const isValid = warrantyEndDate ? now <= warrantyEndDate : false;
    const daysRemaining = isValid 
      ? Math.ceil((warrantyEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      serial: {
        serialNumber: productSerial.serialNumber,
        productName: productSerial.name,
        model: productSerial.model,
        manufactureDate: productSerial.manufactureDate,
        purchaseDate: productSerial.purchaseDate,
        warrantyRemaining: `${daysRemaining} days`,
        status: productSerial.warrantyStatus,
        repairHistory: productSerial.warrantyHistory.map(history => ({
          id: history.id,
          actionType: history.actionType,
          description: history.description,
          performedAt: history.performedAt,
          performedBy: history.performedBy,
        })),
      },
      contract: productSerial.contract ? {
        contractNumber: productSerial.contract.contractNumber,
        startDate: productSerial.contract.startDate,
        endDate: productSerial.contract.endDate,
        terms: productSerial.contract.termsConditions,
        status: productSerial.contract.status,
      } : null,
      warranty: {
        isValid,
        status: productSerial.warrantyStatus,
        startDate: productSerial.manufactureDate,
        endDate: warrantyEndDate,
        daysRemaining,
      },
    };
  }

  async createWarrantyRequest(createWarrantyRequestDto: CreateWarrantyRequestDto) {
    const productSerial = await this.prisma.productSerial.findUnique({
      where: { serialNumber: createWarrantyRequestDto.serialNumber },
      include: {
        contract: true,
      },
    });

    if (!productSerial) {
      throw new NotFoundException(`Serial number ${createWarrantyRequestDto.serialNumber} not found`);
    }

    const ticketNumber = `WR-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const ticket = await this.prisma.ticket.create({
      data: {
        ticketNumber,
        productSerialId: productSerial.id,
        issueDescription: `${createWarrantyRequestDto.issue}: ${createWarrantyRequestDto.description}`,
        priority: createWarrantyRequestDto.priority,
        assignedTo: createWarrantyRequestDto.assignedTo,
        customerName: createWarrantyRequestDto.customerName,
        customerEmail: createWarrantyRequestDto.customerEmail,
        customerPhone: createWarrantyRequestDto.customerPhone,
      },
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        history: {
          include: {
            performer: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Warranty request created successfully',
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        serialNumber: productSerial.serialNumber,
        customerName: ticket.customerName,
        issue: createWarrantyRequestDto.issue,
        description: createWarrantyRequestDto.description,
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
    };
  }

  async updateSerial(id: string, updateProductSerialDto: UpdateProductSerialDto) {
    await this.findSerialById(id);
    
    return this.prisma.productSerial.update({
      where: { id },
      data: updateProductSerialDto,
      include: {
        contract: true,
      },
    });
  }

  async updateSerialWarrantyStatus(id: string, status: WarrantyStatus, notes?: string) {
    const productSerial = await this.findSerialById(id);
    
    const updatedSerial = await this.prisma.productSerial.update({
      where: { id },
      data: { warrantyStatus: status },
      include: {
        contract: true,
      },
    });

    await this.prisma.warrantyHistory.create({
      data: {
        productSerialId: id,
        actionType: ActionType.status_changed,
        description: notes || `Warranty status changed to ${status}`,
        performedBy: 'system',
      },
    });

    return updatedSerial;
  }

  async removeSerial(id: string) {
    const productSerial = await this.prisma.productSerial.findUnique({
      where: { id },
      include: {
        contract: true,
      },
    });

    if (!productSerial) {
      throw new NotFoundException(`Product Serial with ID ${id} not found`);
    }
    
    await this.prisma.productSerial.delete({
      where: { id },
    });

    return { success: true, message: 'Product Serial deleted successfully' };
  }

  private formatProductSerial(productSerial: any) {
    try {
      const now = new Date();
      const warrantyEndDate = productSerial.purchaseDate 
        ? new Date(productSerial.purchaseDate.getTime() + ((productSerial.warrantyMonths || 12) * 30 * 24 * 60 * 60 * 1000)) 
        : null;
      
      const isValid = warrantyEndDate ? now <= warrantyEndDate : false;
      const daysRemaining = warrantyEndDate 
        ? Math.max(0, Math.ceil((warrantyEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;
      
      const warrantyRemaining = isValid 
        ? `${daysRemaining} days remaining`
        : 'Warranty expired';

      let status = 'active';
      if (productSerial.warrantyStatus === 'expired' || !isValid) {
        status = 'expired';
      } else if (productSerial.warrantyStatus === 'suspended') {
        status = 'suspended';
      }

      return {
        id: productSerial.id,
        serialNumber: productSerial.serialNumber,
        productName: productSerial.name || 'Unknown Product',
        model: productSerial.model || 'Unknown Model',
        category: productSerial.category || null,
        description: productSerial.description,
        warrantyMonths: productSerial.warrantyMonths,
        isActive: productSerial.isActive,
        manufactureDate: productSerial.manufactureDate,
        purchaseDate: productSerial.purchaseDate,
        contractId: productSerial.contractId,
        warrantyStatus: productSerial.warrantyStatus,
        warrantyRemaining,
        status,
        repairHistory: productSerial.warrantyHistory ? productSerial.warrantyHistory.map(history => ({
          date: history.performedAt.toISOString().split('T')[0],
          issue: history.description,
          action: history.actionType,
          technician: history.performedBy,
        })) : [],
        notes: productSerial.notes,
        createdAt: productSerial.createdAt,
        updatedAt: productSerial.updatedAt,
      };
    } catch (error) {
      console.error('Error formatting product serial:', error);
      throw error;
    }
  }

  private formatSerialWithProduct(productSerial: any) {
    return this.formatProductSerial(productSerial);
  }
}