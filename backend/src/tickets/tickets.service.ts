import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { TicketStatus, TicketPriority } from '@prisma/client';
import { TicketsTransformer } from './tickets.transformer';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    const ticket = await this.prisma.ticket.create({
      data: createTicketDto,
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        assignee: true,
        comments: true,
      },
    });
    return TicketsTransformer.transformTicket(ticket);
  }

  async findAll() {
    const tickets = await this.prisma.ticket.findMany({
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        assignee: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return TicketsTransformer.transformTickets(tickets);
  }

  async findById(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        assignee: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return TicketsTransformer.transformTicket(ticket);
  }

  async findByStatus(status: TicketStatus) {
    const tickets = await this.prisma.ticket.findMany({
      where: { status },
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        assignee: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return TicketsTransformer.transformTickets(tickets);
  }

  async findByPriority(priority: TicketPriority) {
    const tickets = await this.prisma.ticket.findMany({
      where: { priority },
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        assignee: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return TicketsTransformer.transformTickets(tickets);
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    await this.findById(id);
    
    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        assignee: true,
        comments: true,
      },
    });
    return TicketsTransformer.transformTicket(ticket);
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
    
    const ticket = await this.prisma.ticket.delete({
      where: { id },
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        assignee: true,
        comments: true,
      },
    });
    return TicketsTransformer.transformTicket(ticket);
  }
}