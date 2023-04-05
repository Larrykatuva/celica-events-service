import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EventCategory } from '../interface/event.interface';

export class EventMapperColumnDto {
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;
}

export class CreateEventDto {
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
