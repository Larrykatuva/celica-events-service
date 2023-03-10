import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../shared/guards/auth.guard';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  @Get('test')
  @UseGuards(AuthGuard)
  testAuth(): string {
    return 'tested';
  }
}
