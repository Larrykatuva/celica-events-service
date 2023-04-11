import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { OrderItem } from './orderItem.entity';
import { OrderStatus } from './orderStatus.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  owner: User;

  @Column({ type: 'decimal', precision: 2 })
  amount: number;

  @Column({ default: false })
  completed: boolean;

  @OneToMany(() => OrderItem, (item) => item.order)
  orderItems: OrderItem[];

  @OneToMany(() => OrderStatus, (status) => status.status)
  status: OrderStatus[];

  @Column({ default: false })
  paid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
