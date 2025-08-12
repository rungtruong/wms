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
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
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
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateTicketCommentDto,
  ) {
    return this.ticketsService.addComment(id, createCommentDto);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.ticketsService.getComments(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}