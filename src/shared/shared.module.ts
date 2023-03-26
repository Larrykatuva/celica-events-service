import { CacheModule, Module } from '@nestjs/common';
import { OrganizerService } from './services/organizer.service';
import { RequestService } from './services/request.service';
import { UserService } from './services/user.service';
import { Organizer } from './entities/organizer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CacheConfigService } from '../config/redis';
import { HttpModule } from '@nestjs/axios';
import { CqrsModule } from '@nestjs/cqrs';
import { UserCommandHandler } from './commands/handlers/userCommandHandler';
import { OrganizerController } from './controllers/organizer.controller';
import { UserController } from './controllers/user.controller';

export const CommandHandlers = [UserCommandHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([Organizer, User]),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    HttpModule,
    CqrsModule,
  ],
  controllers: [OrganizerController, UserController],
  providers: [
    OrganizerService,
    RequestService,
    UserService,
    ...CommandHandlers,
  ],
  exports: [OrganizerService, RequestService, UserService],
})
export class SharedModule {}
