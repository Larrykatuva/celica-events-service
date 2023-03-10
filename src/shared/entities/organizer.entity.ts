import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Organizer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sub: string;

  @Column()
  name: string;

  @Column()
  logo: string;

  @Column()
  country: string;

  @OneToOne(() => User, (user) => user.sub)
  @JoinColumn()
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
