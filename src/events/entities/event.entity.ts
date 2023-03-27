import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
