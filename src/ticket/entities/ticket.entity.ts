import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from '../../orders/entities/orderItem.entity';
import { Event } from '../../events/entities/event.entity';
import { TicketStatus } from './ticketStatus.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.tickets)
  @JoinColumn()
  orderItem: OrderItem;

  @OneToOne(() => TicketStatus, (ticketStatus) => ticketStatus.ticket)
  status: TicketStatus;

  @ManyToOne(() => Event, (event) => event.tickets)
  @JoinColumn()
  event: Event;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
