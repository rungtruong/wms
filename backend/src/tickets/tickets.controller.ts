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
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { User } from '../auth/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TicketStatus, TicketPriority } from '@prisma/client';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll(
    @Query('status') status?: TicketStatus,
    @Query('priority') priority?: TicketPriority,
  ) {
    if (status) {
      return this.ticketsService.findByStatus(status);
    }
    if (priority) {
      return this.ticketsService.findByPriority(priority);
    }
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateTicketDto: UpdateTicketDto,
    @User() user: any
  ) {
    return this.ticketsService.update(id, updateTicketDto, user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @User() user: any
  ) {
    return this.ticketsService.updateStatus(id, updateStatusDto.status, updateStatusDto.note || null, user.id);
  }

  @Patch(':id/assign')
  assignTechnician(
    @Param('id') id: string,
    @Body() assignDto: { technicianId: string; note?: string },
    @User() user: any
  ) {
    return this.ticketsService.assignTechnician(id, assignDto.technicianId, assignDto.note || null, user.id);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.ticketsService.getHistory(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}