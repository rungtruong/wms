import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        contractProducts: {
          include: {
            contract: true,
          },
        },
        serials: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByModel(model: string) {
    return this.prisma.product.findMany({
      where: {
        model: {
          contains: model,
          mode: 'insensitive',
        },
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findById(id);
    
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findById(id);
    
    return this.prisma.product.delete({
      where: { id },
    });
  }
}