import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TicketCategoryService } from '../services/ticketCategory.service';
import {
  CreateTicketCategoryDto,
  TicketCategoryResponseDto,
  UpdateTicketCategoryDto,
} from '../dto/ticketCategory.dto';
import { TicketCategory } from '../entities/ticketCategory.entity';
import { AuthRoles } from '../../shared/decorators/roles.decorators';
import {
  CELICA_STAFF_ROLES,
  ORGANIZER_STAFF_ROLE,
} from '../../shared/interfaces/roles.interfaces';
import { SharedResponse } from '../../shared/decorators/response.decorators';
import { RoleService } from '../../shared/services/role.service';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { UserInfoResponse } from '../../shared/interfaces/shared.interface';
import { OrganizerService } from '../../shared/services/organizer.service';
import { EventService } from '../../events/services/event.service';

@ApiTags('Ticket')
@Controller('ticket/category')
export class TicketCategoryController {
  constructor(
    private ticketCategoryService: TicketCategoryService,
    private roleService: RoleService,
    private organizerService: OrganizerService,
    private eventService: EventService,
  ) {}

  @Post()
  @AuthRoles(...CELICA_STAFF_ROLES, ...ORGANIZER_STAFF_ROLE)
  @SharedResponse(TicketCategoryResponseDto)
  async addTicketCategory(
    @Body() body: CreateTicketCategoryDto,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<TicketCategory> {
    if (!body.quantity && body.hasLimit == true)
      throw new BadRequestException(
        'Please specify quantity of tickets for this category',
      );
    if (!(await this.roleService.isCelicaStaff(user.sub))) {
      const { organizer } = await this.organizerService.getOrganizerAffiliate(
        user.sub,
      );
      if (
        !(await this.eventService.filterEvent({
          id: body.event,
          organizer: { id: organizer.id },
        }))
      )
        throw new BadRequestException('Event not found');
    }
    return await this.ticketCategoryService.addTicketCategory(
      body.event,
      body.category,
      body.quantity,
      body.hasLimit,
    );
  }

  @Get('id')
  @SharedResponse(TicketCategoryResponseDto, 200)
  async getTicketCategory(@Param('id') id: string): Promise<TicketCategory> {
    const category = await this.ticketCategoryService.filterTicketCategory({
      id: id,
    });
    if (category) throw new BadRequestException('Ticket category not found');
    return category;
  }

  @Patch(':id')
  @AuthRoles(...CELICA_STAFF_ROLES, ...ORGANIZER_STAFF_ROLE)
  @SharedResponse(TicketCategoryResponseDto, 200)
  async updateTicketCategory(
    @Param('id') id: string,
    @Body() body: UpdateTicketCategoryDto,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<TicketCategory> {
    if (!body.quantity && body.hasLimit == true)
      throw new BadRequestException(
        'Please specify quantity of tickets for this category',
      );
    if (!(await this.roleService.isCelicaStaff(user.sub))) {
      const { organizer } = await this.organizerService.getOrganizerAffiliate(
        user.sub,
      );
      const event = await this.eventService.filterEvent({
        id: id,
        organizer: { id: organizer.id },
      });
      if (!event) throw new BadRequestException('Event not found');
    }
    return await this.ticketCategoryService.updateTicketCategory(
      { id: id },
      {
        quantity: body.quantity,
        category: body.category,
        hasLimit: body.hasLimit,
      },
    );
  }
}
