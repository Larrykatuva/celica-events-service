import { ApiProperty } from '@nestjs/swagger';
import { TicketStatusResDto } from './ticketStatus.dto';

export enum TICKET_STATUS {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  REVOKED = 'REVOKED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export class TicketResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderItem: string;

  @ApiProperty({ type: [TicketStatusResDto] })
  status: TicketStatusResDto[];

  @ApiProperty()
  accessCode: string;

  @ApiProperty()
  event: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
