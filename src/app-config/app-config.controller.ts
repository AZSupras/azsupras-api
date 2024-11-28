import { Controller, Get, Logger, NotFoundException, InternalServerErrorException, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { AppConfig } from './app-config.entity';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { DeleteResult } from 'typeorm';

@Controller('config')
export class AppConfigController {
  private readonly logger = new Logger(AppConfigController.name);
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  async getLatestConfig() {
    const config: AppConfig|null = await this.appConfigService.getLatest();

    if (!config) {
      this.logger.warn('No app config found');
      throw new InternalServerErrorException('No app config found');
    }

    return config;
  }

  @Get('all')
  async getAllConfigs() {
    const config: AppConfig[] = await this.appConfigService.findAll();

    if (!config) {
      this.logger.warn('No app config found');
      throw new InternalServerErrorException('No app config found');
    }

    return config;
  }
  
  @Post()
  async upsert(@Body() createAppConfigDto: CreateAppConfigDto): Promise<AppConfig> {
    return await this.appConfigService.upsert(createAppConfigDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.appConfigService.delete(id);
  }
}
