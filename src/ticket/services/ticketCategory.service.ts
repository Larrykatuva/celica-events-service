import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketCategory } from '../entities/ticketCategory.entity';
import { Repository } from 'typeorm';
import { TICKET_CATEGORY } from '../interface/ticket.interface';
import { EventService } from '../../events/services/event.service';

@Injectable()
export class TicketCategoryService {
  constructor(
    @InjectRepository(TicketCategory)
    private ticketCategoryRepository: Repository<TicketCategory>,
    private eventService: EventService,
  ) {}

  /**
   * Filter event ticket category by filter options and additional options provided.
   * @param filterOptions
   * @param options
   */
  async filterTicketCategory(
    filterOptions: any,
    options?: any,
  ): Promise<TicketCategory> {
    try {
      return await this.ticketCategoryRepository.findOne({
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  /**
   * Add ticket event category if it does not exist.
   * @param eventId
   * @param category
   * @param quantity
   * @param hasLimit
   */
  async addTicketCategory(
    eventId: string,
    category: TICKET_CATEGORY,
    quantity = 0,
    hasLimit = true,
  ): Promise<TicketCategory> {
    const event = await this.eventService.filterEvent({ id: eventId });
    if (!event) throw new BadRequestException('Event not found');
    if (await this.filterTicketCategory({ event: event, category: category }))
      throw new BadRequestException('Event ticket category is already set.');
    return await this.ticketCategoryRepository.save({
      event: event,
      category: category,
      quantity: quantity,
      hasLimit: hasLimit,
    });
  }

  /**
   * Update ticket category by filter options with data passed.
   * @param filterOptions
   * @param data
   */
  async updateTicketCategory(
    filterOptions: any,
    data: { category?: TICKET_CATEGORY; quantity?: number; hasLimit?: boolean },
  ): Promise<TicketCategory> {
    if (!(await this.filterTicketCategory(filterOptions)))
      throw new BadRequestException('Ticket category not found');
    await this.ticketCategoryRepository.update(
      { ...filterOptions },
      { ...data },
    );
    return await this.filterTicketCategory(filterOptions);
  }
}
