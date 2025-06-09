import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createTicketDto: CreateTicketDto, reporterId: string) {
    // Create ticket
    const ticket = await this.prisma.ticket.create({
      data: {
        ...createTicketDto,
        reporter: { connect: { id: reporterId } },
      },
      include: {
        reporter: true,
        property: true,
        unit: true,
      },
    });

    // Analyze ticket with AI
    const analysis = await this.aiService.analyzeTicket(ticket);
    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { aiAnalysis: analysis },
    });

    // Notify property manager
    if (ticket.property.managerId) {
      await this.notificationsService.create({
        userId: ticket.property.managerId,
        type: 'TICKET',
        title: 'New Maintenance Ticket',
        message: `New ticket created: ${ticket.title}`,
        metadata: { ticketId: ticket.id },
      });
    }

    return ticket;
  }

  async findAll(propertyId?: string) {
    return this.prisma.ticket.findMany({
      where: propertyId ? { propertyId } : undefined,
      include: {
        reporter: true,
        property: true,
        unit: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        reporter: true,
        property: true,
        unit: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
      include: {
        reporter: true,
        property: true,
        unit: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    // Notify reporter of status change
    if (updateTicketDto.status) {
      await this.notificationsService.create({
        userId: ticket.reporterId,
        type: 'TICKET',
        title: 'Ticket Status Updated',
        message: `Your ticket "${ticket.title}" is now ${updateTicketDto.status.toLowerCase()}`,
        metadata: { ticketId: ticket.id },
      });
    }

    return ticket;
  }

  async remove(id: string) {
    const ticket = await this.prisma.ticket.delete({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return { message: 'Ticket deleted successfully' };
  }

  async getAnalytics(propertyId: string) {
    const tickets = await this.prisma.ticket.findMany({
      where: { propertyId },
    });

    const totalTickets = tickets.length;
    const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
    const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
    const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED').length;
    const closedTickets = tickets.filter((t) => t.status === 'CLOSED').length;

    const priorityDistribution = {
      LOW: tickets.filter((t) => t.priority === 'LOW').length,
      MEDIUM: tickets.filter((t) => t.priority === 'MEDIUM').length,
      HIGH: tickets.filter((t) => t.priority === 'HIGH').length,
      URGENT: tickets.filter((t) => t.priority === 'URGENT').length,
    };

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      priorityDistribution,
    };
  }
} 