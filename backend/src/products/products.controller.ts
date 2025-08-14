import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductSerialDto } from './dto/create-product-serial.dto';
import { UpdateProductSerialDto } from './dto/update-product-serial.dto';
import { UpdateWarrantyStatusDto } from './dto/update-warranty-status.dto';
import { CreateWarrantyRequestDto } from './dto/create-warranty-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductSerialDto: CreateProductSerialDto) {
    return this.productsService.create(createProductSerialDto);
  }

  @Get()
  findAll(@Query('model') model?: string) {
    if (model) {
      return this.productsService.findByModel(model);
    }
    return this.productsService.findAll();
  }

  @Post('serials')
  @UseGuards(JwtAuthGuard)
  createSerial(@Body() createProductSerialDto: CreateProductSerialDto) {
    return this.productsService.createSerial(createProductSerialDto);
  }

  @Get('serials')
  @UseGuards(JwtAuthGuard)
  findAllSerials() {
    return this.productsService.findAllSerials();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductSerialDto: UpdateProductSerialDto) {
    return this.productsService.update(id, updateProductSerialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Public()
  @Get('serials/warranty/:serialNumber')
  async getWarrantyDetails(@Param('serialNumber') serialNumber: string) {
    return this.productsService.getWarrantyDetails(serialNumber);
  }

  @Get('serials/customer/:customerEmail')
  @UseGuards(JwtAuthGuard)
  findSerialsByCustomer(@Param('customerEmail') customerEmail: string) {
    return this.productsService.findSerialsByCustomerEmail(customerEmail);
  }

  @Post('serials/warranty-request')
  createWarrantyRequest(@Body() createWarrantyRequestDto: CreateWarrantyRequestDto) {
    return this.productsService.createWarrantyRequest(createWarrantyRequestDto);
  }

  @Get('serials/:id')
  @UseGuards(JwtAuthGuard)
  findOneSerial(@Param('id') id: string) {
    return this.productsService.findSerialById(id);
  }

  @Get('serials/number/:serialNumber')
  @UseGuards(JwtAuthGuard)
  findSerialByNumber(@Param('serialNumber') serialNumber: string) {
    return this.productsService.findBySerialNumber(serialNumber);
  }

  @Patch('serials/:id')
  @UseGuards(JwtAuthGuard)
  updateSerial(@Param('id') id: string, @Body() updateProductSerialDto: UpdateProductSerialDto) {
    return this.productsService.updateSerial(id, updateProductSerialDto);
  }

  @Patch('serials/:id/warranty-status')
  @UseGuards(JwtAuthGuard)
  updateSerialWarrantyStatus(
    @Param('id') id: string,
    @Body() updateWarrantyStatusDto: UpdateWarrantyStatusDto,
  ) {
    return this.productsService.updateSerialWarrantyStatus(
      id,
      updateWarrantyStatusDto.status,
      updateWarrantyStatusDto.notes,
    );
  }

  @Delete('serials/:id')
  @UseGuards(JwtAuthGuard)
  removeSerial(@Param('id') id: string) {
    return this.productsService.removeSerial(id);
  }
}