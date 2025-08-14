import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { TicketPriority } from '@prisma/client';

export class CreateWarrantyRequestDto {
  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsNotEmpty()
  issueTitle: string;

  @IsString()
  @IsNotEmpty()
  issueDescription: string;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority = TicketPriority.medium;

  @IsString()
  @IsOptional()
  assignedTo?: string;
}