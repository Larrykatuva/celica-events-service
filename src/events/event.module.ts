import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { SharedModule } from '../shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';
import { EventService } from './services/event.service';
import { EventMapperService } from './services/eventMapper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventMapper } from './entities/eventMapper.entity';
import { EventImage } from './entities/eventImage.entity';
import { EventStatus } from './entities/eventStatus.entity';
import { Event } from './entities/event.entity';
import { EventImageService } from './services/eventImage.service';
import { EventMapperController } from "./controllers/eventMapper.controller";

@Module({
  imports: [
    SharedModule,
    CqrsModule,
    TypeOrmModule.forFeature([Event, EventMapper, EventImage, EventStatus]),
  ],
  controllers: [EventsController, EventMapperController],
  providers: [EventService, EventMapperService, EventImageService],
  exports: [EventService],
})
export class EventModule {}
