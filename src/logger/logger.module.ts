import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from '@/app-config/app-config.service';

@Module({
    providers: [LoggerService, ConfigService],
    exports: [LoggerService],
})
export class LoggerModule { }