import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto, organizationId: string) {
    return this.prisma.property.create({
      data: {
        ...createPropertyDto,
        organization: { connect: { id: organizationId } },
      },
      include: {
        organization: true,
        manager: true,
        units: true,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.property.findMany({
      where: { organizationId },
      include: {
        organization: true,
        manager: true,
        units: true,
      },
    });
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        organization: true,
        manager: true,
        units: {
          include: {
            tenant: true,
          },
        },
        tickets: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.prisma.property.update({
      where: { id },
      data: updatePropertyDto,
      include: {
        organization: true,
        manager: true,
        units: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async remove(id: string) {
    const property = await this.prisma.property.delete({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return { message: 'Property deleted successfully' };
  }

  async getAnalytics(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        units: {
          include: {
            tenant: true,
          },
        },
        tickets: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Calculate occupancy rate
    const totalUnits = property.units.length;
    const occupiedUnits = property.units.filter(
      (unit) => unit.status === 'OCCUPIED',
    ).length;
    const occupancyRate = (occupiedUnits / totalUnits) * 100;

    // Calculate average rent
    const totalRent = property.units.reduce((sum, unit) => sum + unit.rent, 0);
    const averageRent = totalRent / totalUnits;

    // Calculate ticket statistics
    const totalTickets = property.tickets.length;
    const openTickets = property.tickets.filter(
      (ticket) => ticket.status === 'OPEN',
    ).length;
    const resolvedTickets = property.tickets.filter(
      (ticket) => ticket.status === 'RESOLVED',
    ).length;

    return {
      occupancyRate,
      averageRent,
      totalUnits,
      occupiedUnits,
      totalTickets,
      openTickets,
      resolvedTickets,
    };
  }

  async assignManager(propertyId: string, managerId: string) {
    const property = await this.prisma.property.update({
      where: { id: propertyId },
      data: {
        manager: { connect: { id: managerId } },
      },
      include: {
        manager: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return property;
  }
} 