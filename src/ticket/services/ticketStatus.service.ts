import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketStatus } from '../entities/ticketStatus.entity';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TICKET_STATUS } from '../dto/ticket.dto';

@Injectable()
export class TicketStatusService {
  constructor(
    @InjectRepository(TicketStatus)
    private ticketStatusRepository: Repository<TicketStatus>,
  ) {}

  async createTicketStatus(data: {
    status: TICKET_STATUS;
    ticket: Ticket;
  }): Promise<TicketStatus> {
    return await this.ticketStatusRepository.save(data);
  }
}
