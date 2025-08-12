import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateTicketCommentDto {
  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean = false;
}