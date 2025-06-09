import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketPriority, TicketStatus } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ description: 'Title of the ticket' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the issue' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Priority level of the ticket', enum: TicketPriority })
  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @ApiProperty({ description: 'ID of the property where the issue is located' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ description: 'ID of the unit where the issue is located', required: false })
  @IsUUID()
  @IsOptional()
  unitId?: string;

  @ApiProperty({ description: 'Current status of the ticket', enum: TicketStatus, required: false })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;
} 