import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { OrganizerService } from '../../shared/services/organizer.service';
import { CreateEventDto } from '../dtos/event.dtos';
import { EventMapper } from '../entities/eventMapper.entity';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { EventMapperService } from './eventMapper.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private organizerService: OrganizerService,
    private eventMapperService: EventMapperService,
  ) {}

  /**
   * Prepare event mapper objects for event custom fields and event mapper fields.
   * @param event
   */
  async prepareEventMapperObject(
    event: CreateEventDto,
  ): Promise<[Partial<EventMapper>, Partial<Event>]> {
    delete event.organizer;
    delete event.location;
    delete event.description;
    const eventsMapperArr = Object.entries(event);
    const count = 1;
    const mapperKeysObj = {};
    const eventValuesObj = {};
    for (let i = 0; i <= eventsMapperArr.length; i++) {
      mapperKeysObj[`field${count.toString()}`] = eventsMapperArr[i]['key'];
      eventValuesObj[`field${count.toString()}`] = eventsMapperArr[i]['value'];
    }
    return [mapperKeysObj, eventValuesObj];
  }

  /**
   * Filter event by filter options and optional options supplied.
   * @param filterOptions
   * @param options
   */
  async filterEvent(filterOptions: any, options?: any): Promise<Event> {
    try {
      return await this.eventRepository.findOne({
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Get a paginated list of events by filter options and optional options supplied.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterEvents(
    pagination: DefaultPagination,
    filterOptions?: any,
    options?: any,
  ): Promise<[Event[], number]> {
    try {
      return await this.eventRepository.findAndCount({
        where: { ...filterOptions },
        ...pagination,
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update event by filter options with update data.
   * @param filterOptions
   * @param updateOptions
   */
  async updateEvent(filterOptions: any, updateOptions: any): Promise<Event> {
    const event = await this.filterEvent(filterOptions);
    if (!event) throw new BadRequestException('Event not found');
    await this.eventRepository.update(
      { ...filterOptions },
      { ...updateOptions },
    );
    return await this.filterEvent(filterOptions);
  }

  /**
   * Create an event and event mapper if organizer has supplied optional fields.
   * @param event
   * @param cover
   */
  async createEvent(event: CreateEventDto, cover: string): Promise<Event> {
    const organizer = await this.organizerService.filterOrganizer({
      sub: event.organizer,
    });
    if (!organizer) throw new BadRequestException('Invalid organizer id');
    const eventMapper = this.prepareEventMapperObject(event);
    const newEvent = await this.eventRepository.save({
      organizer: organizer,
      location: event.location,
      category: event.category,
      cover: cover,
      description: event.description,
      ...eventMapper[1],
    });
    if (eventMapper[0]) {
      await this.eventMapperService.createEventMapper({
        event: newEvent,
        ...eventMapper[0],
      });
    }
    return newEvent;
  }
}
