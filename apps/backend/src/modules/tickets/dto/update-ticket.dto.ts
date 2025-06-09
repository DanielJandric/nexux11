import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketPriority, TicketStatus } from '@prisma/client';

export class UpdateTicketDto {
  @ApiProperty({ description: 'Title of the ticket', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Description of the issue', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Priority level of the ticket', enum: TicketPriority, required: false })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiProperty({ description: 'Current status of the ticket', enum: TicketStatus, required: false })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiProperty({ description: 'ID of the assigned staff member', required: false })
  @IsUUID()
  @IsOptional()
 