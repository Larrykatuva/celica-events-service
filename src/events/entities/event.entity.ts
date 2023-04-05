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
import { EventStatus } from './eventStatus.entity';
import { EventMapper } from './eventMapper.entity';
import { EventImage } from './eventImage.entity';
import { EventCategory } from '../interface/event.interface';
import { Ticket } from "../../ticket/entities/ticket.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: EventCategory })
  category: EventCategory;

  @OneToOne(() => Organizer, (organizer) => organizer.sub)
  @JoinColumn()
  organizer: Organizer;

  @Column()
  cover: string;

  @Column()
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  field1: string;

  @Column({ type: 'text', nullable: true })
  field2: string;

  @Column({ type: 'text', nullable: true })
  field3: string;

  @Column({ type: 'text', nullable: true })
  field4: string;

  @Column({ type: 'text', nullable: true })
  field5: string;

  @Column({ type: 'text', nullable: true })
  field6: string;

  @Column({ type: 'text', nullable: true })
  field7: string;

  @Column({ type: 'text', nullable: true })
  field8: string;

  @Column({ type: 'text', nullable: true })
  field9: string;

  @Column({ type: 'text', nullable: true })
  field10: string;

  @OneToMany(() => EventStatus, (eventStatus) => eventStatus.event)
  status: EventStatus[];

  @OneToOne(() => EventMapper, (eventMapper) => eventMapper.event)
  mapper: EventMapper;

  @OneToMany(() => EventImage, (eventImage) => eventImage.event)
  images: EventImage[];

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
