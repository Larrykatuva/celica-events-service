import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organizer } from '../../shared/entities/organizer.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Organizer, (organizer) => organizer.sub)
  @JoinColumn()
  organizer: Organizer;

  // @OneToMany(() => Ticket, (ticket) => ticket.event)
  // tickets: Ticket[];

  @Column()
  cover: string;

  @Column()
  location: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
