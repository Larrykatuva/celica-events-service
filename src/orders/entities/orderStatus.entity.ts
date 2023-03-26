import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum ORDER_STATUS {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  REDEEMED = 'REDEEMED',
  REFUNDED = 'REFUNDED',
}

@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.id)
  @JoinColumn()
  order: Order;

  @Column({ type: 'enum', enum: ORDER_STATUS, default: ORDER_STATUS.ACTIVE })
  status: ORDER_STATUS;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
