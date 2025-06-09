import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyType, PropertyStatus } from '@prisma/client';

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiProperty({ enum: PropertyStatus, required: false })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
} 