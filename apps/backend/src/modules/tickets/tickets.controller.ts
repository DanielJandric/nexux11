import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles(UserRole.TENANT, UserRole.STAFF, UserRole.PROPERTY_MANAGER)
  @ApiOperation({ summary: 'Create a new maintenance ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  create(@Body() createTicketDto: CreateTicketDto, @Req() req) {
    return this.ticketsService.create(createTicketDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.STAFF, UserRole.PROPERTY_MANAGER)
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'Return all tickets' })
  findAll(@Req() req) {
    return this.ticketsService.findAll(req.user.propertyId);
  }

  @Get(':id')
  @Roles(UserRole.TENANT, UserRole.STAFF, UserRole.PROPERTY_MANAGER)
  @ApiOperation({ summary: 'Get a ticket by ID' })
  @ApiResponse({ status: 200, description: 'Return the ticket' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.STAFF, UserRole.PROPERTY_MANAGER)
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @Roles(UserRole.PROPERTY_MANAGER)
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }

  @Get('analytics/:propertyId')
  @Roles(UserRole.PROPERTY_MANAGER)
  @ApiOperation({ summary: 'Get ticket analytics for a property' })
  @ApiResponse({ status: 200, description: 'Return ticket analytics' })
  getAnalytics(@Param('propertyId') propertyId: string) {
    return this.ticketsService.getAnalytics(propertyId);
  }
} 