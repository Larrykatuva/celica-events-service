import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseConfig from './database/connection';
import { SharedModule } from './shared/shared.module';
import { EventModule } from './events/event.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
