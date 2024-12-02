import {
  Controller,
  Get,
  Logger,
  InternalServerErrorException,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { AppConfig } from './app-config.entity';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { DeleteResult } from 'typeorm';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';

@Controller('config')
export class AppConfigController {
  private readonly logger = new Logger(AppConfigController.name);
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  async getLatestConfig() {
    const data: AppConfig | null = await this.appConfigService.getLatest();

    if (!data) {
      this.logger.warn('No app config found');
      throw new InternalServerErrorException('No app config found');
    }

    const response: IResponseWithRelation<AppConfig> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return response;
  }

  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Get('all')
  async getAllConfigs() {
    const data: AppConfig[] = await this.appConfigService.findAll();

    if (!data) {
      this.logger.warn('No app config found');
      throw new InternalServerErrorException('No app config found');
    }

    const response: IResponseWithRelation<AppConfig[]> = {
      statusCode: 200,
      message: 'Success',
      count: data.length,
      data,
    };

    return response;
  }

  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Post()
  async upsert(
    @Body() createAppConfigDto: CreateAppConfigDto,
  ): Promise<IResponseWithRelation<AppConfig>> {
    if (!createAppConfigDto) {
      throw new InternalServerErrorException('No data provided');
    }
    
    const data: AppConfig =
      await this.appConfigService.upsert(createAppConfigDto);

    const response: IResponseWithRelation<AppConfig> = {
      statusCode: 200,
      message: 'Record upserted',
      data,
    };

    return response;
  }

  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IResponseWithRelation<DeleteResult>> {
    const data: DeleteResult = await this.appConfigService.delete(id);

    const response: IResponseWithRelation<DeleteResult> = {
      statusCode: 200,
      message:
        data.affected && data.affected > 0
          ? 'Record deleted'
          : 'Record not found',
      data,
    };

    return response;
  }
}
