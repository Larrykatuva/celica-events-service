import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TICKET_CATEGORY } from '../interface/ticket.interface';

export class CreateTicketCategoryDto {
  @ApiProperty({ required: true })
  event: string;

  @ApiProperty({ required: true, enum: TICKET_CATEGORY })
  category: TICKET_CATEGORY;

  @ApiProperty({ nullable: true })
  quantity: number;

  @ApiProperty({ nullable: true })
  hasLimit: boolean;
}

export class UpdateTicketCategoryDto extends OmitType(CreateTicketCategoryDto, [
  'event',
] as const) {}

export class TicketCategoryResponseDto extends CreateTicketCategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
