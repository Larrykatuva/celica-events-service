import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  owner: User;

  @ManyToOne(() => Event, (event) => event.id)
  @JoinColumn()
  event: Event;

  @Column({ type: 'decimal', precision: 2 })
  amount: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
