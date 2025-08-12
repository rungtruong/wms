import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto) {
    const { products, ...contractData } = createContractDto;
    
    return this.prisma.contract.create({
      data: {
        ...contractData,
        contractProducts: {
          create: products?.map(product => ({
            productId: product.productId,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
          })) || [],
        },
      },
      include: {
        contractProducts: {
          include: {
            product: true,
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
            product: true,
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
            product: true,
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
            product: true,
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
    
    const { products, ...contractData } = updateContractDto;

    return this.prisma.contract.update({
      where: { id },
      data: {
        ...contractData,
        ...(products && {
          contractProducts: {
            deleteMany: {},
            create: products.map(product => ({
              productId: product.productId,
              quantity: product.quantity,
              unitPrice: product.unitPrice,
            })),
          },
        }),
      },
      include: {
        contractProducts: {
          include: {
            product: true,
          },
        },
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
            product: true,
          },
        },
      },
    });
  }
}