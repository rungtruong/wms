import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { WarrantyStatus } from '@prisma/client';

export class CreateProductSerialDto {
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  warrantyMonths?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  manufactureDate?: string | Date;

  @IsOptional()
  purchaseDate?: string | Date;

  @IsString()
  @IsOptional()
  contractId?: string;

  @IsEnum(WarrantyStatus)
  @IsOptional()
  warrantyStatus?: WarrantyStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}