import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: createNotificationDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string) {
    return this.prisma.notification.findMany({
      where: userId ? { userId } : {},
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async markAsRead(id: string) {
    await this.findById(id);
    
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async markAllAsRead(userId?: string) {
    return this.prisma.notification.updateMany({
      where: {
        read: false,
        ...(userId && { userId }),
      },
      data: { read: true },
    });
  }

  async getUnreadCount(userId?: string) {
    const count = await this.prisma.notification.count({
      where: {
        read: false,
        ...(userId && { userId }),
      },
    });

    return { count };
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.findById(id);
    
    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    
    return this.prisma.notification.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }
}