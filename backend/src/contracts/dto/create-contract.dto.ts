import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContractStatus } from '@prisma/client';

class ContractProductDto {
  @IsString()
  @IsNotEmpty()
  productSerialId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  contractNumber: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsOptional()
  customerAddress?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus = ContractStatus.active;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractProductDto)
  @IsOptional()
  contractProducts?: ContractProductDto[];
}