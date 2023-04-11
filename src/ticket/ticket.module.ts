import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketStatus } from './entities/ticketStatus.entity';
import { TicketCategory } from './entities/ticketCategory.entity';
import { TicketService } from './services/ticket.service';
import { TicketCategoryService } from './services/ticketCategory.service';
import { TicketStatusService } from './services/ticketStatus.service';
import { TicketCategoryController } from './controllers/ticketCategory.controller';
import { EventModule } from '../events/event.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    SharedModule,
    EventModule,
    CqrsModule,
    TypeOrmModule.forFeature([Ticket, TicketStatus, TicketCategory]),
  ],
  providers: [TicketService, TicketCategoryService, TicketStatusService],
  controllers: [TicketCategoryController],
  exports: [TicketCategoryService, TicketService],
})
export class TicketModule {}
