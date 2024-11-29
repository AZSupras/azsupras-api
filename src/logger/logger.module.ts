import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from 'src/app-config/app-config.service';

@Module({
    providers: [LoggerService, ConfigService],
    exports: [LoggerService],
})
export class LoggerModule { }