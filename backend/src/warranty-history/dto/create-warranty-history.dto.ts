import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
  IsNumber,
  IsDecimal,
} from 'class-validator';
import { ActionType } from '@prisma/client';

export class CreateWarrantyHistoryDto {
  @IsUUID()
  serialId: string;

  @IsEnum(ActionType)
  actionType: ActionType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsDecimal()
  cost?: number;

  @IsUUID()
  performedBy: string;
}