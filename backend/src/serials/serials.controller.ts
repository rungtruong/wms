import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SerialsService } from './serials.service';
import { CreateSerialDto } from './dto/create-serial.dto';
import { UpdateSerialDto } from './dto/update-serial.dto';
import { UpdateWarrantyStatusDto } from './dto/update-warranty-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('serials')
export class SerialsController {
  constructor(private readonly serialsService: SerialsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSerialDto: CreateSerialDto) {
    return this.serialsService.create(createSerialDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.serialsService.findAll();
  }

  @Get('warranty/:serialNumber')
  checkWarranty(@Param('serialNumber') serialNumber: string) {
    return this.serialsService.checkWarranty(serialNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.serialsService.findById(id);
  }

  @Get('number/:serialNumber')
  @UseGuards(JwtAuthGuard)
  findByNumber(@Param('serialNumber') serialNumber: string) {
    return this.serialsService.findBySerialNumber(serialNumber);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSerialDto: UpdateSerialDto) {
    return this.serialsService.update(id, updateSerialDto);
  }

  @Patch(':id/warranty-status')
  @UseGuards(JwtAuthGuard)
  updateWarrantyStatus(
    @Param('id') id: string,
    @Body() updateWarrantyStatusDto: UpdateWarrantyStatusDto,
  ) {
    return this.serialsService.updateWarrantyStatus(
      id,
      updateWarrantyStatusDto.status,
      updateWarrantyStatusDto.notes,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.serialsService.remove(id);
  }
}