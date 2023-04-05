import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { TICKET_STATUS } from '../dto/ticket.dto';

@Entity()
export class TicketStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TICKET_STATUS })
  status: TICKET_STATUS;

  @OneToOne(() => Ticket, (ticket) => ticket.status)
  ticket: Ticket;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
