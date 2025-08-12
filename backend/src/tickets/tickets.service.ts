import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { TicketStatus, TicketPriority } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: createTicketDto,
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
        comments: true,
      },
    });
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async findByStatus(status: TicketStatus) {
    return this.prisma.ticket.findMany({
      where: { status },
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByPriority(priority: TicketPriority) {
    return this.prisma.ticket.findMany({
      where: { priority },
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    await this.findById(id);
    
    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
        comments: true,
      },
    });
  }

  async addComment(ticketId: string, createCommentDto: CreateTicketCommentDto) {
    await this.findById(ticketId);
    
    return this.prisma.ticketComment.create({
      data: {
        ...createCommentDto,
        ticketId,
      },
    });
  }

  async getComments(ticketId: string) {
    await this.findById(ticketId);
    
    return this.prisma.ticketComment.findMany({
      where: { ticketId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    
    return this.prisma.ticket.delete({
      where: { id },
      include: {
        serial: {
          include: {
            product: true,
            contract: true,
          },
        },
        comments: true,
      },
    });
  }
}