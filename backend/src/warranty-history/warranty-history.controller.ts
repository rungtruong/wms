import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WarrantyHistoryService } from './warranty-history.service';
import { CreateWarrantyHistoryDto } from './dto/create-warranty-history.dto';
import { UpdateWarrantyHistoryDto } from './dto/update-warranty-history.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActionType } from '@prisma/client';

@Controller('warranty-history')
@UseGuards(JwtAuthGuard)
export class WarrantyHistoryController {
  constructor(private readonly warrantyHistoryService: WarrantyHistoryService) {}

  @Post()
  create(@Body() createWarrantyHistoryDto: CreateWarrantyHistoryDto) {
    return this.warrantyHistoryService.create(createWarrantyHistoryDto);
  }

  @Get()
  findAll(@Query('actionType') actionType?: ActionType) {
    if (actionType) {
      return this.warrantyHistoryService.findByActionType(actionType);
    }
    return this.warrantyHistoryService.findAll();
  }

  @Get('serial/:serialId')
  findBySerialId(@Param('serialId') serialId: string) {
    return this.warrantyHistoryService.findBySerialId(serialId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warrantyHistoryService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarrantyHistoryDto: UpdateWarrantyHistoryDto,
  ) {
    return this.warrantyHistoryService.update(id, updateWarrantyHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warrantyHistoryService.remove(id);
  }
}