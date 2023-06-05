import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EventResponseDto } from '../../events/dtos/event.dtos';

export class CreateAffiliateDto {
  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  event: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  profile: any;
}

export class UpdateAffiliateDto extends PartialType(
  OmitType(CreateAffiliateDto, ['fullName', 'event']),
) {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  event: string;
}

export class AffiliateResDto extends PartialType(
  OmitType(CreateAffiliateDto, ['event']),
) {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  event: EventResponseDto;
}
