import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, OrderResDto } from '../dto/order.dto';
import { Order } from '../entities/order.entity';
import { RoleService } from '../../shared/services/role.service';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { UserInfoResponse } from '../../shared/interfaces/shared.interface';
import {
  SharedPaginatedResponse,
  SharedResponse,
} from '../../shared/decorators/response.decorators';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../../shared/decorators/query.decorators';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@ApiTags('Order')
@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private roleService: RoleService,
  ) {}

  @Post()
  @SharedResponse(OrderResDto)
  async createOrder(
    @Body() body: CreateOrderDto,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<Order> {
    if (!(await this.roleService.isStaff(user.sub))) {
      body.owner = user.sub;
    } else {
      if (!body.owner)
        throw new BadRequestException('Please set the order owner');
    }
    return await this.orderService.createOrder(body.owner, 0);
  }

  @Get()
  @SharedPaginatedResponse(OrderResDto)
  async getOrders(
    @ExtractRequestUser() user: UserInfoResponse,
    @ExtractRequestPagination() pagination: DefaultPagination,
    @SharedQueryExtractor() query: any,
  ): Promise<[Order[], number]> {
    if (!(await this.roleService.isStaff(user.sub))) {
      query = { owner: { id: user.sub }, ...query };
    }
    return await this.orderService.filterOrders(pagination, query, {
      relations: ['orderItems', 'status'],
    });
  }

  @Get(':id')
  @SharedResponse(OrderResDto, 200)
  async getOrder(
    @ExtractRequestUser() user: UserInfoResponse,
    @Param('id') id: string,
  ): Promise<Order> {
    let query: any = { id: id };
    if (!(await this.roleService.isStaff(user.sub))) {
      query = { owner: { id: user.sub }, ...query };
    }
    const order = await this.orderService.filterOrder(query, {
      relations: ['orderItems', 'status'],
    });
    if (!order) throw new BadRequestException('Order not found');
    return order;
  }
}
