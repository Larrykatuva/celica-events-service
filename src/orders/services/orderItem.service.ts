import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../entities/orderItem.entity';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrderItem(
    order: Order,
    quantity: number,
    unitPrice: number,
  ): Promise<OrderItem> {
    const orderItem = new OrderItem();
    orderItem.order = order;
    orderItem.quantity = quantity;
    orderItem.unitPrice = unitPrice;
    return await this.orderItemRepository.save(orderItem);
  }

  async filterOrderItem(filterOptions: any): Promise<OrderItem> {
    return await this.orderItemRepository.findOne({
      where: { ...filterOptions },
    });
  }
}
