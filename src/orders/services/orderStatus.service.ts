import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ORDER_STATUS, OrderStatus } from '../entities/orderStatus.entity';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
  ) {}

  /**
   * Create an order status.
   * @param order
   * @param status
   */
  async createOrderStatus(
    order: Order,
    status: ORDER_STATUS,
  ): Promise<OrderStatus> {
    return await this.orderStatusRepository.save({
      order: order,
      status: status,
    });
  }

  /**
   * Filter order status
   * @param filterOptions
   */
  async filterOrderStatus(filterOptions: any): Promise<OrderStatus> {
    return await this.orderStatusRepository.findOne({
      where: { ...filterOptions },
    });
  }
}
