import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { AppModule } from './app.module';
import { LogLevel, NestApplicationOptions } from '@nestjs/common';
import * as session from 'express-session';
import { RedisStore } from 'connect-redis';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import {createClient} from "redis"
import { SeedData_Users, SeedUserDto } from './seeder/SeederData';
import { setup } from './setup';

const logger = new LoggerService('Main');

async function bootstrap() {
  const applicationOptions: NestApplicationOptions = {
    cors: {
      origin: 'http://localhost:4000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    },
    bufferLogs: true,
    logger: logger,
  };

  const app = await NestFactory.create(AppModule, applicationOptions);
  const config = app.get(ConfigService);

  const apiHost: string = config.get<string>('API_HOST') || 'localhost';
  const apiPort: number = config.get<number>('API_PORT') || 3000;
  const apiPrefix: string = config.get<string>('API_PREFIX');
  
  setup(app);

  app.setGlobalPrefix(apiPrefix);
  await app.listen(apiPort, apiHost);
  
  return {
    app,
    apiBaseUrl: `http://${apiHost}:${apiPort}/${apiPrefix}`
  }
}

bootstrap()
.then(({ app, apiBaseUrl}) => {
  const { username, password, ...defaultAdminUser}: SeedUserDto = SeedData_Users[0];
  
  setTimeout(() => {
    logger.printStartupBanner(apiBaseUrl, username, password);
  }, 500);
});
