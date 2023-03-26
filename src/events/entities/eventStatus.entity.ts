import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from '../../shared/entities/user.entity';

export enum EVENT_STATUS {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED',
}

@Entity()
export class EventStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.id)
  @JoinColumn()
  event: Event;

  @Column({ type: 'enum', enum: EVENT_STATUS, default: EVENT_STATUS.ACTIVE })
  status: EVENT_STATUS;

  @ManyToOne(() => User, (user) => user.sub)
  @JoinColumn()
  actionBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
