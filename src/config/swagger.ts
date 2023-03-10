import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger configuration settings.
 */
const config = new DocumentBuilder()
  .setTitle('EVENTS SERVICE')
  .setDescription('Celica events service API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
export default config;
