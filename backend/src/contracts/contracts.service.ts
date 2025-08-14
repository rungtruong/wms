import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto) {
    const { contractProducts, startDate, endDate, ...contractData } = createContractDto;
    
    // Convert date strings to Date objects
    const processedData = {
      ...contractData,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
    
    return await this.prisma.contract.create({
      data: {
        ...processedData,
        contractProducts: {
          create: contractProducts?.map(product => ({
            productSerialId: product.productSerialId,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            notes: product.notes,
          })) || [],
        },
      },
      include: {
        contractProducts: {
          include: {
            productSerial: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.contract.findMany({
      include: {
        contractProducts: {
          include: {
            productSerial: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        contractProducts: {
          include: {
            productSerial: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  async findByContractNumber(contractNumber: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { contractNumber },
      include: {
        contractProducts: {
          include: {
            productSerial: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with number ${contractNumber} not found`);
    }

    return contract;
  }

  async update(id: string, updateContractDto: UpdateContractDto) {
    await this.findById(id);
    
    const { contractProducts, startDate, endDate, ...contractData } = updateContractDto;
    
    // Convert date strings to Date objects if they exist
    const processedData = {
      ...contractData,
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    };

    return this.prisma.contract.update({
       where: { id },
       data: {
         ...processedData,
        ...(contractProducts && {
          contractProducts: {
            deleteMany: {},
            create: contractProducts.map(product => ({
              productSerialId: product.productSerialId,
              quantity: product.quantity,
              unitPrice: product.unitPrice,
            })),
          },
        }),
      },
      include: {
        contractProducts: {
          include: {
            productSerial: true,
          },
        },
      },
    });
  }

  async findByCustomerEmail(customerEmail: string) {
    return this.prisma.contract.findMany({
      where: {
        customerEmail: customerEmail,
      },
      include: {
        contractProducts: {
          include: {
            productSerial: true,
          },
        },
        productSerials: {
          include: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    
    return this.prisma.contract.delete({
      where: { id },
      include: {
        contractProducts: {
          include: {
            productSerial: true,
          },
        },
      },
    });
  }
}