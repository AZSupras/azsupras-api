import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { AppModule } from './app.module';
import { LogLevel, NestApplicationOptions } from '@nestjs/common';
import { setup } from './setup';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedData, } from './seeder/data';
import { CreateUserDto } from './user/dto/create-user.dto';
 
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
  
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Arizona Supra\'s Api')
  .setDescription('The Arizona Supra\'s Api description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, documentFactory, {
    jsonDocumentUrl: 'api/swagger/json',
  });
  
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
  const { username, password, ...defaultAdminUser}: CreateUserDto = SeedData.users[0];
  
  setTimeout(() => {
    logger.printStartupBanner(apiBaseUrl, username, password);
  }, 500);
});
