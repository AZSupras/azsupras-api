import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { AppModule } from './app.module';
import { NestApplicationOptions } from '@nestjs/common';

async function bootstrap() {
  const logger = new LoggerService('Bootstrap');
  const applicationOptions: NestApplicationOptions = {
    cors: {
      origin: 'http://localhost:4000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    },
    logger: logger,
  };
  const app = await NestFactory.create(AppModule, applicationOptions);

  const config = app.get(ConfigService);

  const apiHost: string = config.get<string>('API_HOST') || 'localhost';
  const apiPort: number = config.get<number>('API_PORT') || 3000;
  const apiPrefix: string = config.get<string>('API_PREFIX');

  app.setGlobalPrefix(apiPrefix);

  logger.debug(
    `API is accessible via http://${apiHost}:${apiPort}/${apiPrefix}`,
  );

  await app.listen(apiPort, apiHost);
}

bootstrap();
