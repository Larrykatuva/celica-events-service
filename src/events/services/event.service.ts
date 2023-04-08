import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { OrganizerService } from '../../shared/services/organizer.service';
import { CreateEventDto } from '../dtos/event.dtos';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { EventMapperService } from './eventMapper.service';
import { EventImage } from '../entities/eventImage.entity';
import { EVENT_STATUS, EventStatus } from '../entities/eventStatus.entity';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(EventImage)
    private eventImageRepository: Repository<EventImage>,
    @InjectRepository(EventStatus)
    private eventStatusRepository: Repository<EventStatus>,
    private organizerService: OrganizerService,
    private eventMapperService: EventMapperService,
    private userService: UserService,
  ) {}

  async addEventImage(event: Event): Promise<EventImage> {
    return await this.eventImageRepository.save({
      event: event,
      eventImage: '',
    });
  }

  /**
   * Prepare event mapper objects for event custom fields and event mapper fields.
   * @param event
   */
  prepareEventMapperObject(event: CreateEventDto): [any, any] {
    delete event.organizer;
    delete event.location;
    delete event.description;
    delete event.category;
    const eventsMapperArr = Object.entries(event);
    const count = 1;
    const mapperKeysObj = {};
    const eventValuesObj = {};
    for (let i = 0; i < eventsMapperArr.length; i++) {
      let field = eventsMapperArr[i][1];
      if (typeof eventsMapperArr[i][1] == 'string')
        field = JSON.parse(eventsMapperArr[i][1]);
      mapperKeysObj[`field${count.toString()}`] = field['key'];
      eventValuesObj[`field${count.toString()}`] = field['value'];
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
    const eventData = {
      organizer: organizer,
      location: event.location,
      category: event.category,
      cover: cover,
      description: event.description,
    };
    if (!organizer) throw new BadRequestException('Invalid organizer id');
    const eventMapper = this.prepareEventMapperObject(event);
    const newEvent = await this.eventRepository.save({
      ...eventData,
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

  // async updateEvent()

  async setEventStatus(
    eventId: string,
    status: EVENT_STATUS,
    actionBy: string,
  ): Promise<EventStatus> {
    const user = await this.userService.filterUser({ sub: actionBy });
    if (!user) throw new BadRequestException('Invalid user id');
    const event = await this.filterEvent({ id: eventId });
    if (!event) throw new BadRequestException('Invalid event id');
    return await this.eventStatusRepository.save({
      event: event,
      status: status,
      actionBy: user,
    });
  }
}
