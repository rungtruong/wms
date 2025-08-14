import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { TicketStatus, TicketPriority, ActionType } from "@prisma/client";
import { TicketsTransformer } from "./tickets.transformer";
import { EmailService } from "../email/email.service";

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

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
        history: {
          include: {
            performer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Tạo history entry cho việc tạo ticket
    await this.createHistoryEntry(
      ticket.id,
      ActionType.created,
      "Ticket được tạo",
      null,
      null,
      createTicketDto.assignedTo
    );

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
        history: {
          include: {
            performer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
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
        history: {
          include: {
            performer: true,
          },
          orderBy: {
            createdAt: "asc",
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
        history: {
          include: {
            performer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
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
        history: {
          include: {
            performer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return TicketsTransformer.transformTickets(tickets);
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, userId: string) {
    const existingTicket = await this.findById(id);

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
        history: {
          include: {
            performer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Tạo history entries cho các thay đổi
    await this.trackChanges(existingTicket, updateTicketDto, userId);

    return TicketsTransformer.transformTicket(ticket);
  }

  async updateStatus(
    id: string,
    status: TicketStatus,
    note: string | null,
    userId: string
  ) {
    const existingTicket = await this.findById(id);

    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: { status },
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        assignee: true,
        history: {
          include: {
            performer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Tạo history entry với note làm description
    await this.trackStatusChange(existingTicket, status, note, userId);

    return TicketsTransformer.transformTicket(ticket);
  }

  async assignTechnician(
    id: string,
    technicianId: string,
    note: string | null,
    userId: string
  ) {
    const existingTicket = await this.findById(id);

    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: { assignedTo: technicianId },
      include: {
        productSerial: {
          include: {
            contract: true,
          },
        },
        assignee: true,
        history: {
          include: {
            performer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Tạo history entry cho việc phân công
    const description = note || "Ticket đã được phân công cho kỹ thuật viên";
    await this.createHistoryEntry(
      id,
      ActionType.assigned,
      description,
      existingTicket.assignedTo,
      technicianId,
      userId
    );

    return TicketsTransformer.transformTicket(ticket);
  }

  async getHistory(ticketId: string) {
    await this.findById(ticketId);

    return this.prisma.ticketHistory.findMany({
      where: { ticketId },
      include: {
        performer: true,
      },
      orderBy: {
        createdAt: "asc",
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
        history: {
          include: {
            performer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return TicketsTransformer.transformTicket(ticket);
  }

  private async createHistoryEntry(
    ticketId: string,
    actionType: ActionType,
    description: string,
    oldValue: string | null,
    newValue: string | null,
    performedBy: string
  ) {
    return this.prisma.ticketHistory.create({
      data: {
        ticketId,
        actionType,
        description,
        oldValue,
        newValue,
        performedBy,
      },
    });
  }

  private async trackStatusChange(
    existingTicket: any,
    newStatus: TicketStatus,
    note: string | null,
    performedBy: string
  ) {
    if (newStatus !== existingTicket.status) {
      let actionType: ActionType;
      let description: string;

      if (note) {
        description = note;
        actionType = ActionType.status_changed;
      } else {
        switch (newStatus) {
          case TicketStatus.in_progress:
            actionType = ActionType.assigned;
            description = "Ticket được tiếp nhận và bắt đầu xử lý";
            break;
          case TicketStatus.resolved:
            actionType = ActionType.resolved;
            description = "Ticket đã được giải quyết";
            break;
          case TicketStatus.closed:
            actionType = ActionType.closed;
            description = "Ticket đã được đóng";
            break;
          case TicketStatus.open:
            actionType = ActionType.reopened;
            description = "Ticket đã được mở lại";
            break;
          default:
            actionType = ActionType.status_changed;
            description = `Trạng thái ticket đã thay đổi từ ${existingTicket.status} thành ${newStatus}`;
        }
      }

      await this.createHistoryEntry(
        existingTicket.id,
        actionType,
        description,
        existingTicket.status,
        newStatus,
        performedBy
      );
    }
  }

  private async trackChanges(
    existingTicket: any,
    updateDto: UpdateTicketDto,
    performedBy: string
  ) {
    if (updateDto.status && updateDto.status !== existingTicket.status) {
      let actionType: ActionType;
      let description: string;

      switch (updateDto.status) {
        case TicketStatus.in_progress:
          actionType = ActionType.assigned;
          description = "Ticket được tiếp nhận và bắt đầu xử lý";
          break;
        case TicketStatus.resolved:
          actionType = ActionType.resolved;
          description = "Ticket đã được giải quyết";
          break;
        case TicketStatus.closed:
          actionType = ActionType.closed;
          description = "Ticket đã được đóng";
          break;
        case TicketStatus.open:
          actionType = ActionType.reopened;
          description = "Ticket đã được mở lại";
          break;
        default:
          actionType = ActionType.status_changed;
          description = `Trạng thái ticket đã thay đổi từ ${existingTicket.status} thành ${updateDto.status}`;
      }

      await this.createHistoryEntry(
        existingTicket.id,
        actionType,
        description,
        existingTicket.status,
        updateDto.status,
        performedBy
      );
    }

    if (updateDto.priority && updateDto.priority !== existingTicket.priority) {
      await this.createHistoryEntry(
        existingTicket.id,
        ActionType.priority_changed,
        `Độ ưu tiên đã thay đổi từ ${existingTicket.priority} thành ${updateDto.priority}`,
        existingTicket.priority,
        updateDto.priority,
        performedBy
      );
    }

    if (
      updateDto.assignedTo &&
      updateDto.assignedTo !== existingTicket.assignedTo
    ) {
      await this.createHistoryEntry(
        existingTicket.id,
        ActionType.assigned,
        "Ticket đã được gán cho nhân viên khác",
        existingTicket.assignedTo,
        updateDto.assignedTo,
        performedBy
      );
    }
  }

  async sendEmail(id: string, userId: string) {
    const ticket = await this.findById(id);

    // Chỉ cho phép gửi email khi status là resolved hoặc closed
    if (ticket.status !== "resolved" && ticket.status !== "closed") {
      throw new BadRequestException(
        "Chỉ có thể gửi email khi ticket đã được giải quyết hoặc đóng"
      );
    }

    // Kiểm tra thông tin khách hàng
    if (!ticket.customerEmail) {
      throw new BadRequestException("Không tìm thấy email khách hàng");
    }

    try {
      // Gửi email
      await this.emailService.sendTicketNotification(
        {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          customerEmail: ticket.customerEmail,
          customerName: ticket.customerName,
          issueDescription: ticket.issueDescription,
          status: ticket.status,
          createdAt: ticket.createdAt.toISOString(),
          resolvedAt: ticket.updatedAt.toISOString(),
          product: ticket.productSerial
            ? {
                name: ticket.productSerial.product?.name || "N/A",
                serial: ticket.productSerial.serialNumber,
              }
            : undefined,
          assignedTechnician: ticket.assignee
            ? {
                fullName: ticket.assignee.fullName,
                email: ticket.assignee.email,
              }
            : undefined,
        },
        ticket.status === "resolved" ? "resolved" : "closed"
      );

      // Tạo history entry
      await this.createHistoryEntry(
        id,
        ActionType.status_changed,
        `Email thông báo đã được gửi đến khách hàng (${ticket.customerEmail})`,
        null,
        null,
        userId
      );

      return { success: true, message: "Email đã được gửi thành công" };
    } catch (error) {
      throw new BadRequestException(
        "Có lỗi xảy ra khi gửi email: " + error.message
      );
    }
  }
}
