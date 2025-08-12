import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { WarrantyStatus } from '@prisma/client';

export class CreateSerialDto {
  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsOptional()
  @IsDateString()
  warrantyStartDate?: Date;

  @IsOptional()
  @IsDateString()
  warrantyEndDate?: Date;

  @IsEnum(WarrantyStatus)
  @IsOptional()
  warrantyStatus?: WarrantyStatus = WarrantyStatus.active;

  @IsString()
  @IsOptional()
  notes?: string;
}