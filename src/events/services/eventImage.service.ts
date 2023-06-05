import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventImage } from '../entities/eventImage.entity';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventImageService {
  constructor(
    @InjectRepository(EventImage)
    private eventImageRepository: Repository<EventImage>,
  ) {}

  async addEventImage(event: Event): Promise<EventImage> {
    return await this.eventImageRepository.save({
      event: event,
      eventImage: uuidv4(),
    });
  }
}
