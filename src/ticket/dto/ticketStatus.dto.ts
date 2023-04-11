import { ApiProperty } from '@nestjs/swagger';
import { TICKET_STATUS } from './ticket.dto';

export class TicketStatusResDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: TICKET_STATUS })
  status: TICKET_STATUS;

  @ApiProperty()
  ticket: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
