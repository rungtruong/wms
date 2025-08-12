import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WarrantyStatus } from '@prisma/client';

export class UpdateWarrantyStatusDto {
  @IsEnum(WarrantyStatus)
  status: WarrantyStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}