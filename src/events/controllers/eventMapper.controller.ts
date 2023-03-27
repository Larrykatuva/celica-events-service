import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventMapper } from '../entities/eventMapper.entity';
import { EventMapperService } from '../services/eventMapper.service';
import { SharedResponse } from '../../shared/decorators/response.decorators';
import {
  EventMapperResponseDto,
  UpdateEventMapperDto,
} from '../dtos/eventMapper.dtos';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { AuthRoles } from '../../shared/decorators/roles.decorators';
import {
  CELICA_STAFF_ROLES,
  ORGANIZER_STAFF_ROLE,
} from '../../shared/interfaces/roles.interfaces';

@ApiTags('EVENT')
@Controller('event-mapper')
export class EventMapperController {
  constructor(private eventMapperService: EventMapperService) {}

  @Get(':eventId')
  @SharedResponse(EventMapperResponseDto)
  async getEventMapper(
    @Param('eventId') eventId: string,
  ): Promise<EventMapper> {
    return await this.eventMapperService.filterEventMapper({
      event: { id: eventId },
    });
  }

  @Patch(':eventId')
  @UseGuards(AuthGuard)
  @AuthRoles(...CELICA_STAFF_ROLES, ...ORGANIZER_STAFF_ROLE)
  @SharedResponse(EventMapperResponseDto)
  async updateEventMapper(
    @Param('eventId') eventId: string,
    @Body() body: UpdateEventMapperDto,
  ): Promise<EventMapper> {
    return await this.eventMapperService.updateEventMapper(
      { event: { id: eventId } },
      body,
    );
  }
}
