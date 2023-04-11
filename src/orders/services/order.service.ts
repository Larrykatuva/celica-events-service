import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../shared/services/user.service';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private userService: UserService,
  ) {}

  /**
   * Create an order record.
   * @param sub
   * @param amount
   */
  async createOrder(sub: string, amount: number): Promise<Order> {
    const user = await this.userService.filterUser({ sub: sub });
    if (!user) throw new BadRequestException('User not found');
    return await this.orderRepository.save({
      owner: user,
      amount: amount,
    });
  }

  /**
   * Filter order by filter options and optional options passed.
   * @param filterOptions
   * @param options
   */
  async filterOrder(filterOptions: any, options?: any): Promise<Order> {
    try {
      return await this.orderRepository.findOne({
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  /**
   * Get a paginated list of orders and filter by optional filter options passed plus additional options specified.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterOrders(
    pagination: DefaultPagination,
    filterOptions?: any,
    options?: any,
  ): Promise<[Order[], number]> {
    try {
      return await this.orderRepository.findAndCount({
        where: { ...filterOptions },
        ...pagination,
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  /**
   * Update order by filter options with update data.
   * @param filterOptions
   * @param data
   */
  async updateOrder(filterOptions: any, data: Partial<Order>): Promise<Order> {
    if (!(await this.filterOrders(filterOptions)))
      throw new BadRequestException('Order not found');
    await this.orderRepository.update({ ...filterOptions }, data);
    return await this.filterOrder(filterOptions);
  }
}
