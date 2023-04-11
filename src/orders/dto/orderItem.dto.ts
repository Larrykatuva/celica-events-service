import { ApiProperty } from '@nestjs/swagger';
import { TicketResDto } from '../../ticket/dto/ticket.dto';

export class CreateOrderItemDto {
  @ApiProperty({ required: true })
  ticketCategory: string;

  @ApiProperty({ required: true })
  order: string;

  @ApiProperty({ required: true })
  quantity: number;
}

export class OrderItemResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: [TicketResDto] })
  tickets: null | TicketResDto[];

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
