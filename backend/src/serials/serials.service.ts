import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSerialDto } from './dto/create-serial.dto';
import { UpdateSerialDto } from './dto/update-serial.dto';
import { WarrantyStatus } from '@prisma/client';

@Injectable()
export class SerialsService {
  constructor(private prisma: PrismaService) {}

  async create(createSerialDto: CreateSerialDto) {
    const existingSerial = await this.prisma.serial.findUnique({
      where: { serialNumber: createSerialDto.serialNumber },
    });

    if (existingSerial) {
      throw new BadRequestException(`Serial number ${createSerialDto.serialNumber} already exists`);
    }

    return this.prisma.serial.create({
      data: createSerialDto,
      include: {
        product: true,
        contract: true,
      },
    });
  }

  async findAll() {
    return this.prisma.serial.findMany({
      include: {
        product: true,
        contract: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const serial = await this.prisma.serial.findUnique({
      where: { id },
      include: {
        product: true,
        contract: true,
        tickets: {
          include: {
            comments: true,
          },
        },
        warrantyHistory: true,
      },
    });

    if (!serial) {
      throw new NotFoundException(`Serial with ID ${id} not found`);
    }

    return serial;
  }

  async findBySerialNumber(serialNumber: string) {
    const serial = await this.prisma.serial.findUnique({
      where: { serialNumber },
      include: {
        product: true,
        contract: true,
        tickets: {
          include: {
            comments: true,
          },
        },
        warrantyHistory: true,
      },
    });

    if (!serial) {
      throw new NotFoundException(`Serial number ${serialNumber} not found`);
    }

    return serial;
  }

  async checkWarranty(serialNumber: string) {
    const serial = await this.findBySerialNumber(serialNumber);
    
    const now = new Date();
    const warrantyEndDate = serial.purchaseDate ? new Date(serial.purchaseDate.getTime() + (serial.product.warrantyMonths * 30 * 24 * 60 * 60 * 1000)) : null;
    
    const isValid = now <= warrantyEndDate;
    const daysRemaining = isValid 
      ? Math.ceil((warrantyEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      serial,
      warranty: {
        isValid,
        status: serial.warrantyStatus,
        startDate: serial.manufactureDate,
        endDate: serial.purchaseDate,
        daysRemaining,
      },
    };
  }

  async update(id: string, updateSerialDto: UpdateSerialDto) {
    await this.findById(id);
    
    return this.prisma.serial.update({
      where: { id },
      data: updateSerialDto,
      include: {
        product: true,
        contract: true,
      },
    });
  }

  async updateWarrantyStatus(id: string, status: WarrantyStatus, notes?: string) {
    const serial = await this.findById(id);
    
    const updatedSerial = await this.prisma.serial.update({
      where: { id },
      data: { warrantyStatus: status },
      include: {
        product: true,
        contract: true,
      },
    });

    await this.prisma.warrantyHistory.create({
      data: {
        serialId: id,
        actionType: 'maintenance',
        description: notes || `Warranty status changed to ${status}`,
        performedBy: 'system', // This should be the actual user ID
      },
    });

    return updatedSerial;
  }

  async remove(id: string) {
    await this.findById(id);
    
    return this.prisma.serial.delete({
      where: { id },
      include: {
        product: true,
        contract: true,
      },
    });
  }
}