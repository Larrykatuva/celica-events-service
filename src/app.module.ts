import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseConfig from './database/connection';
import { SharedModule } from './shared/shared.module';
import { EventModule } from './events/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseConfig,
    SharedModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
