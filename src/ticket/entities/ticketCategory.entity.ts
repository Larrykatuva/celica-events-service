import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { TICKET_CATEGORY } from '../interface/ticket.interface';

@Entity()
export class TicketCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.ticketCategory)
  @JoinColumn()
  event: Event;

  @Column({ enum: TICKET_CATEGORY, type: 'enum' })
  category: TICKET_CATEGORY;

  @Column()
  price: number;

  @Column()
  sold: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ default: true })
  hasLimit: boolean;
}
