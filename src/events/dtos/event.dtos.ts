import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator';
import { EventCategory } from '../interface/event.interface';
import { EVENT_STATUS } from '../entities/eventStatus.entity';
import { UpdateEventMapperDto } from './eventMapper.dtos';

export class EventMapperColumnDto {
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;
}

export class EventUpdateDto {
  @ApiProperty({ enum: EventCategory })
  category: EventCategory;

  @ApiProperty()
  location: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  field1: EventMapperColumnDto;

  @ApiProperty()
  field2: EventMapperColumnDto;

  @ApiProperty()
  field3: EventMapperColumnDto;

  @ApiProperty()
  field4: EventMapperColumnDto;

  @ApiProperty()
  field5: EventMapperColumnDto;

  @ApiProperty()
  field6: EventMapperColumnDto;

  @ApiProperty()
  field7: EventMapperColumnDto;

  @ApiProperty()
  field8: EventMapperColumnDto;

  @ApiProperty()
  field9: EventMapperColumnDto;

  @ApiProperty()
  field10: EventMapperColumnDto;
}

export class CreateEventDto extends PartialType(
  OmitType(EventUpdateDto, ['category', 'location', 'description'] as const),
) {
  organizer: string;

  @ApiProperty({ enum: EventCategory })
  @IsNotEmpty()
  category: EventCategory;

  @ApiProperty()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

export class EventDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organizer: string;

  @ApiProperty({ enum: EventCategory })
  @IsNotEmpty()
  category: EventCategory;

  @ApiProperty()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  field1: string;

  @ApiProperty()
  field2: string;

  @ApiProperty()
  field3: string;

  @ApiProperty()
  field4: string;

  @ApiProperty()
  field5: string;

  @ApiProperty()
  field6: string;

  @ApiProperty()
  field7: string;

  @ApiProperty()
  field8: string;

  @ApiProperty()
  field9: string;

  @ApiProperty()
  field10: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class EventImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  event: string;

  @ApiProperty()
  eventImage: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class EventStatusDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  event: string;

  @ApiProperty({ enum: EVENT_STATUS })
  status: EVENT_STATUS;

  @ApiProperty()
  actionBy: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class EventStatusUpdateDto {
  @ApiProperty({ enum: EVENT_STATUS })
  status: EVENT_STATUS;
}

export class EventResponseDto extends EventDto {
  @ApiProperty()
  organizer: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  mapper: UpdateEventMapperDto;

  @ApiProperty({ type: [EventImageDto] })
  images: EventImageDto[];

  @ApiProperty({ type: [EventStatusDto] })
  status: EventStatusDto[];
}
