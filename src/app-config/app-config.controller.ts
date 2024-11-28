import { Controller, Get, Logger, NotFoundException, InternalServerErrorException, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { AppConfig } from './app-config.entity';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { DeleteResult } from 'typeorm';
import { IResponse } from 'src/interfaces/IResponse';

@Controller('config')
export class AppConfigController {
  private readonly logger = new Logger(AppConfigController.name);
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  async getLatestConfig() {
    const data: AppConfig|null = await this.appConfigService.getLatest();

    if (!data) {
      this.logger.warn('No app config found');
      throw new InternalServerErrorException('No app config found');
    }

    const response : IResponse<AppConfig> = {
      statusCode: 200,
      message: 'Success',
      data,
    }
  
    return response;
  }

  @Get('all')
  async getAllConfigs() {
    const data: AppConfig[] = await this.appConfigService.findAll();

    if (!data) {
      this.logger.warn('No app config found');
      throw new InternalServerErrorException('No app config found');
    }

    const response : IResponse<AppConfig[]> = {
      statusCode: 200,
      message: 'Success',
      count: data.length,
      data,
    }
  
    return response;
  }
  
  @Post()
  async upsert(@Body() createAppConfigDto: CreateAppConfigDto): Promise<IResponse<AppConfig>> {
    const data: AppConfig = await this.appConfigService.upsert(createAppConfigDto);

    const response : IResponse<AppConfig> = {
      statusCode: 200,
      message: 'Record upserted',
      data,
    }
  
    return response;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IResponse<DeleteResult>> {
    const data: DeleteResult =  await this.appConfigService.delete(id);

    const response : IResponse<DeleteResult> = {
      statusCode: 200,
      message: (data.affected && data.affected > 0) ? 'Record deleted' : 'Record not found',
      data,
    }
  
    return response;
  }
}
