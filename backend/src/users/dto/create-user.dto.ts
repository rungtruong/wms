import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, MinLength, IsDateString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.technician;

  @IsOptional()
  isActive?: boolean = true;

  @IsOptional()
  @IsDateString()
  lastLoginAt?: Date;
}