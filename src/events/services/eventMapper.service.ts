import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventMapper } from '../entities/eventMapper.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventMapperService {
  constructor(
    @InjectRepository(EventMapper)
    private eventMapperRepository: Repository<EventMapper>,
  ) {}

  /**
   * Create event mapper of the custom fields of an event.
   * @param mapper
   */
  async createEventMapper(mapper: EventMapper): Promise<EventMapper> {
    return await this.eventMapperRepository.save(mapper);
  }

  /**
   * Filter one event mapper by filter options and optional fields if supplied.
   * @param filterOptions
   * @param options
   */
  async filterEventMapper(
    filterOptions: any,
    options?: any,
  ): Promise<EventMapper> {
    try {
      return await this.eventMapperRepository.findOne({
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update custom fields of an event by filter options with the update data passed.
   * @param filterOptions
   * @param updateFields
   */
  async updateEventMapper(
    filterOptions: any,
    updateFields: Partial<EventMapper>,
  ): Promise<EventMapper> {
    const mapper = await this.filterEventMapper(filterOptions);
    if (!mapper) throw new BadRequestException('Mapper not found');
    await this.eventMapperRepository.update(
      { ...filterOptions },
      { ...updateFields },
    );
    return await this.filterEventMapper(filterOptions);
  }
}
