import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarrantyHistoryDto } from './dto/create-warranty-history.dto';
import { UpdateWarrantyHistoryDto } from './dto/update-warranty-history.dto';
import { ActionType } from '@prisma/client';

@Injectable()
export class WarrantyHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(createWarrantyHistoryDto: CreateWarrantyHistoryDto) {
    return this.prisma.warrantyHistory.create({
      data: createWarrantyHistoryDto,
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.warrantyHistory.findMany({
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
      },
      orderBy: {
        performedAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const warrantyHistory = await this.prisma.warrantyHistory.findUnique({
      where: { id },
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
      },
    });

    if (!warrantyHistory) {
      throw new NotFoundException(`Warranty history with ID ${id} not found`);
    }

    return warrantyHistory;
  }

  async findBySerialId(serialId: string) {
    return this.prisma.warrantyHistory.findMany({
      where: { serialId },
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
      },
      orderBy: {
        performedAt: 'desc',
      },
    });
  }

  async findByActionType(actionType: ActionType) {
    return this.prisma.warrantyHistory.findMany({
      where: { actionType },
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
      },
      orderBy: {
        performedAt: 'desc',
      },
    });
  }

  async update(id: string, updateWarrantyHistoryDto: UpdateWarrantyHistoryDto) {
    await this.findById(id);
    
    return this.prisma.warrantyHistory.update({
      where: { id },
      data: updateWarrantyHistoryDto,
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    
    return this.prisma.warrantyHistory.delete({
      where: { id },
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
      },
    });
  }
}