import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { TicketPriority, TicketStatus } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  ticketNumber: string;

  @IsString()
  @IsNotEmpty()
  issueDescription: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus = TicketStatus.new;

  @IsUUID()
  serialId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;
}