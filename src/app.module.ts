import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseConfig from './database/connection';
import { SharedModule } from './shared/shared.module';
import { EventModule } from './events/event.module';
import { MulterModule } from '@nestjs/platform-express';
import { TicketModule } from './ticket/ticket.module';
import { OrdersModule } from './orders/orders.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('FILE_UPLOAD_PATH'),
      }),
      inject: [ConfigService],
    }),
    DatabaseConfig,
    SharedModule,
    EventModule,
    TicketModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
