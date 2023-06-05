import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Affiliate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @ManyToMany(() => Event, (event) => event.id)
  event: Event;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  profile: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
