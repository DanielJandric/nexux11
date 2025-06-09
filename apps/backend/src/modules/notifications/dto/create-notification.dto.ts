import { IsString, IsEnum, IsOptional, IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID of the user to notify' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Type of notification', enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'Title of the notification' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Message content of the notification' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Additional metadata for the notification', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 