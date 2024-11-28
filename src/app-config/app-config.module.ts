import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { AppConfigController } from './app-config.controller';
import { AppConfig } from './app-config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppConfig]),
  ],
  controllers: [AppConfigController],
  exports: [AppConfigService, TypeOrmModule],
  providers: [AppConfigService],
})
export class AppConfigModule {}
