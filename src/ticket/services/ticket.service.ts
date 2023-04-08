import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Repository } from 'typeorm';
import { TicketStatusService } from './ticketStatus.service';
import { OrderItem } from '../../orders/entities/orderItem.entity';
import { Event } from '../../events/entities/event.entity';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { TICKET_STATUS } from '../dto/ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private ticketStatusService: TicketStatusService,
  ) {}

  /**
   * Generate unique access codes for every ticket bought.
   */
  async generateAccessCode(): Promise<string> {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let accessCode = '';
    for (let i = 0; i <= 8; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      accessCode += chars.substring(randomNumber, randomNumber + 1);
    }
    if (await this.ticketRepository.findOneBy({ accessCode: accessCode })) {
      accessCode = await this.generateAccessCode();
    }
    return accessCode;
  }

  /**
   * Create a new ticket and corresponding ticket status then mark status as active by default.
   * @param data
   */
  async createTicket(data: {
    orderItem: OrderItem;
    event: Event;
  }): Promise<Ticket> {
    const ticket = await this.ticketRepository.save({
      accessCode: await this.generateAccessCode(),
      ...data,
    });
    await this.ticketStatusService.createTicketStatus({
      status: TICKET_STATUS.ACTIVE,
      ticket: ticket,
    });
    return await this.filterTicket(
      { id: ticket.id },
      { relations: ['status'] },
    );
  }

  async filterTicket(filterOptions: any, options?: any): Promise<Ticket> {
    try {
      return await this.ticketRepository.findOne({
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  /**
   * Get a paginated list of tickets by filter options and other options supplied.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterTickets(
    pagination: DefaultPagination,
    filterOptions?: any,
    options?: any,
  ): Promise<[Ticket[], number]> {
    try {
      return await this.ticketRepository.findAndCount({
        ...pagination,
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }
}
