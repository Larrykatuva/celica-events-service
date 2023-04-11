import { ApiProperty } from '@nestjs/swagger';
import { ORDER_STATUS } from '../entities/orderStatus.entity';

export class OrderStatusResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order: string;

  @ApiProperty({ enum: ORDER_STATUS })
  status: ORDER_STATUS;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
