import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventMapperDto {
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
}

export class EventMapperResponseDto extends UpdateEventMapperDto {
  @ApiProperty()
  event: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
