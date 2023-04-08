import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketStatus } from './entities/ticketStatus.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Ticket, TicketStatus])],
  providers: [],
  controllers: [],
  exports: [],
})
export class TicketModule {}
