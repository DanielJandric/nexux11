import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Ticket } from '@prisma/client';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async analyzeTicket(ticket: Ticket) {
    // TODO: Implement actual AI analysis using OpenAI or similar
    // For now, return a simple analysis based on ticket content
    const analysis = {
      category: this.categorizeTicket(ticket),
      estimatedTime: this.estimateResolutionTime(ticket),
      suggestedPriority: this.suggestPriority(ticket),
      similarTickets: await this.findSimilarTickets(ticket),
    };

    return analysis;
  }

  private categorizeTicket(ticket: Ticket) {
    const description = ticket.description.toLowerCase();
    if (description.includes('leak') || description.includes('water')) {
      return 'PLUMBING';
    } else if (description.includes('power') || description.includes('electric')) {
      return 'ELECTRICAL';
    } else if (description.includes('door') || description.includes('lock')) {
      return 'SECURITY';
    } else if (description.includes('noise') || description.includes('sound')) {
      return 'NOISE';
    } else {
      return 'GENERAL';
    }
  }

  private estimateResolutionTime(ticket: Ticket) {
    const category = this.categorizeTicket(ticket);
    const priority = ticket.priority;

    const baseTimes = {
      PLUMBING: { URGENT: 2, HIGH: 4, MEDIUM: 8, LOW: 24 },
      ELECTRICAL: { URGENT: 4, HIGH: 8, MEDIUM: 16, LOW: 48 },
      SECURITY: { URGENT: 1, HIGH: 2, MEDIUM: 4, LOW: 8 },
      NOISE: { URGENT: 4, HIGH: 8, MEDIUM: 16, LOW: 24 },
      GENERAL: { URGENT: 4, HIGH: 8, MEDIUM: 16, LOW: 48 },
    };

    return baseTimes[category][priority];
  }

  private suggestPriority(ticket: Ticket) {
    const description = ticket.description.toLowerCase();
    const category = this.categorizeTicket(ticket);

    if (
      description.includes('emergency') ||
      description.includes('urgent') ||
      description.includes('immediate') ||
      (category === 'PLUMBING' && description.includes('flood')) ||
      (category === 'ELECTRICAL' && description.includes('spark'))
    ) {
      return 'URGENT';
    } else if (
      description.includes('important') ||
      description.includes('asap') ||
      description.includes('soon')
    ) {
      return 'HIGH';
    } else if (
      description.includes('when possible') ||
      description.includes('no rush')
    ) {
      return 'LOW';
    } else {
      return 'MEDIUM';
    }
  }

  private async findSimilarTickets(ticket: Ticket) {
    const category = this.categorizeTicket(ticket);
    const keywords = this.extractKeywords(ticket.description);

    const similarTickets = await this.prisma.ticket.findMany({
      where: {
        propertyId: ticket.propertyId,
        description: {
          contains: keywords.join(' '),
        },
        category,
        id: {
          not: ticket.id,
        },
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return similarTickets;
  }

  private extractKeywords(description: string) {
    const words = description.toLowerCase().split(' ');
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return words.filter((word) => !stopWords.has(word) && word.length > 3);
  }

  async predictMaintenance(propertyId: string) {
    // TODO: Implement actual predictive maintenance using historical data
    // For now, return a simple prediction based on ticket history
    const tickets = await this.prisma.ticket.findMany({
      where: {
        propertyId,
        status: 'CLOSED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const predictions = {
      plumbing: this.predictCategoryMaintenance(tickets, 'PLUMBING'),
      electrical: this.predictCategoryMaintenance(tickets, 'ELECTRICAL'),
      security: this.predictCategoryMaintenance(tickets, 'SECURITY'),
      general: this.predictCategoryMaintenance(tickets, 'GENERAL'),
    };

    return predictions;
  }

  private predictCategoryMaintenance(tickets: Ticket[], category: string) {
    const categoryTickets = tickets.filter((t) => this.categorizeTicket(t) === category);
    if (categoryTickets.length === 0) return null;

    const lastTicket = categoryTickets[0];
    const daysSinceLastTicket = Math.floor(
      (Date.now() - lastTicket.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      lastIssue: lastTicket.description,
      daysSinceLastIssue: daysSinceLastTicket,
      predictedNextIssue: this.predictNextIssueDate(categoryTickets),
    };
  }

  private predictNextIssueDate(tickets: Ticket[]) {
    if (tickets.length < 2) return null;

    const intervals = [];
    for (let i = 1; i < tickets.length; i++) {
      const interval = Math.floor(
        (tickets[i - 1].createdAt.getTime() - tickets[i].createdAt.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      intervals.push(interval);
    }

    const averageInterval = Math.floor(
      intervals.reduce((a, b) => a + b, 0) / intervals.length
    );

    const lastTicketDate = tickets[0].createdAt;
    const predictedDate = new Date(
      lastTicketDate.getTime() + averageInterval * 24 * 60 * 60 * 1000
    );

    return predictedDate;
  }
} 