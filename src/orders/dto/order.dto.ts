import { ApiProperty } from '@nestjs/swagger';
import { UserInfoResponse } from '../../shared/interfaces/shared.interface';
import { OrderItemResDto } from './orderItem.dto';
import { OrderStatusResDto } from './orderStatus.dto';

export class CreateOrderDto {
  @ApiProperty({ required: false })
  owner: string;
}

export class OrderResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  owner: UserInfoResponse;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  completed: boolean;

  @ApiProperty({ type: [OrderItemResDto] })
  orderItems: OrderItemResDto[];

  @ApiProperty({ type: [OrderStatusResDto] })
  status: OrderStatusResDto[];

  @ApiProperty()
  paid: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
