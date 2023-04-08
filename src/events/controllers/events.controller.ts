import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  CreateEventDto,
  EventResponseDto,
  EventStatusDto,
  EventStatusUpdateDto,
  EventUpdateDto,
} from '../dtos/event.dtos';
import { EventService } from '../services/event.service';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../../shared/decorators/query.decorators';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { Event } from '../entities/event.entity';
import {
  SharedPaginatedResponse,
  SharedResponse,
} from '../../shared/decorators/response.decorators';
import { EventStatus } from '../entities/eventStatus.entity';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { UserInfo } from 'os';
import { AuthRoles } from '../../shared/decorators/roles.decorators';
import {
  CELICA_STAFF_ROLES,
  ORGANIZER_STAFF_ROLE,
} from '../../shared/interfaces/roles.interfaces';
import { UserInfoResponse } from '../../shared/interfaces/shared.interface';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get('test')
  @UseGuards(AuthGuard)
  testAuth(): string {
    return 'tested';
  }

  @Post()
  @UseGuards(AuthGuard)
  @AuthRoles(...CELICA_STAFF_ROLES, ...ORGANIZER_STAFF_ROLE)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'others', maxCount: 2 },
    ]),
  )
  async createNewEvent(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
    @Body() event: CreateEventDto,
  ): Promise<any> {
    if (!files.avatar)
      throw new BadRequestException('Image avatar is required');
    return await this.eventService.createEvent(
      event,
      files.avatar[0].originalname,
    );
  }

  @Get()
  @SharedPaginatedResponse(EventResponseDto)
  async getEvents(
    @ExtractRequestPagination() pagination: DefaultPagination,
    @SharedQueryExtractor() query: any,
  ): Promise<[Event[], number]> {
    return await this.eventService.filterEvents(pagination, query, {
      relations: ['organizer'],
    });
  }

  @Get(':id')
  @SharedResponse(EventResponseDto, 200)
  async getEvent(@Param('id') id: string): Promise<Event> {
    return await this.eventService.filterEvent(
      { id: id },
      { relations: ['mapper', 'organizer', 'images', 'status'] },
    );
  }

  @Post('status/:eventId')
  @SharedResponse(EventStatusDto)
  @AuthRoles(...CELICA_STAFF_ROLES, ...ORGANIZER_STAFF_ROLE)
  async setEventStatus(
    @Param('eventId') eventId: string,
    @Body() data: EventStatusUpdateDto,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<EventStatus> {
    return await this.eventService.setEventStatus(
      eventId,
      data.status,
      user.sub,
    );
  }

  @Patch(':id')
  @AuthRoles(...CELICA_STAFF_ROLES, ...ORGANIZER_STAFF_ROLE)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'others', maxCount: 2 },
    ]),
  )
  async updateEvent(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
    @Body() event: EventUpdateDto,
  ): Promise<any> {

  }
}
