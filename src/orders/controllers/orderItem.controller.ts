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
import { OrderItemService } from '../services/orderItem.service';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { CreateOrderItemDto, OrderItemResDto } from '../dto/orderItem.dto';
import { OrderItem } from '../entities/orderItem.entity';
import { OrderService } from '../services/order.service';
import { RoleService } from '../../shared/services/role.service';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { UserInfoResponse } from '../../shared/interfaces/shared.interface';
import { TicketCategoryService } from '../../ticket/services/ticketCategory.service';
import { TicketService } from '../../ticket/services/ticket.service';
import { SharedResponse } from '../../shared/decorators/response.decorators';

@ApiTags('Order')
@UseGuards(AuthGuard)
@Controller('order-item')
export class OrderItemController {
  constructor(
    private orderItemService: OrderItemService,
    private roleService: RoleService,
    private orderService: OrderService,
    private ticketCategoryService: TicketCategoryService,
    private ticketService: TicketService,
  ) {}

  @Post()
  @SharedResponse(OrderItemResDto)
  async addOrderItem(
    @Body() body: CreateOrderItemDto,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<OrderItem> {
    let orderFilter: any = { id: body.order };
    if (!(await this.roleService.isStaff(user.sub)))
      orderFilter = { owner: { id: user.sub }, ...orderFilter };
    const order = await this.orderService.filterOrder(orderFilter);
    if (!order) throw new BadRequestException('Order not found');
    const ticketCategory =
      await this.ticketCategoryService.filterTicketCategory({
        id: body.ticketCategory,
      });
    if (!ticketCategory)
      throw new BadRequestException('Ticket category not found');
    if (ticketCategory.hasLimit) {
      if (ticketCategory.quantity == ticketCategory.sold)
        throw new BadRequestException('All tickets have been sold out');
      if (ticketCategory.quantity - ticketCategory.sold < body.quantity)
        throw new BadRequestException(
          `Ticket not available consider reducing your quantity to ${
            ticketCategory.quantity - ticketCategory.sold
          }`,
        );
    }
    const orderItem = await this.orderItemService.createOrderItem(
      order,
      body.quantity,
      ticketCategory.price,
    );
    for (let i = 0; i < body.quantity; i++) {
      await this.ticketService.createTicket({
        orderItem: orderItem,
        event: ticketCategory.event,
      });
    }
    return orderItem;
  }

  @Get(':id')
  @SharedResponse(OrderItemResDto)
  async getOrderItem(
    @ExtractRequestUser() user: UserInfoResponse,
    @Param('id') id: string,
  ): Promise<OrderItem> {
    let query: any = { id: id };
    if (!(await this.roleService.isStaff(user.sub)))
      query = { order: { owner: { id: user.sub } }, ...query };
    const orderItem = await this.orderItemService.filterOrderItem(query);
    if (!orderItem) throw new BadRequestException('Order item not found');
    return orderItem;
  }
}
