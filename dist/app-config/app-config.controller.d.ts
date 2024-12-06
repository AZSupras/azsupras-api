import { AppConfigService } from './app-config.service';
import { AppConfig } from './app-config.entity';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { DeleteResult } from 'typeorm';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
export declare class AppConfigController {
    private readonly appConfigService;
    private readonly logger;
    constructor(appConfigService: AppConfigService);
    getLatestConfig(): Promise<IResponseWithRelation<AppConfig>>;
    getAllConfigs(): Promise<IResponseWithRelation<AppConfig[]>>;
    upsert(createAppConfigDto: CreateAppConfigDto): Promise<IResponseWithRelation<AppConfig>>;
    delete(id: string): Promise<IResponseWithRelation<DeleteResult>>;
}
