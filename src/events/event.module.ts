import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { SharedModule } from '../shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [SharedModule, CqrsModule],
  controllers: [EventsController],
  providers: [],
  exports: [],
})
export class EventModule {}
