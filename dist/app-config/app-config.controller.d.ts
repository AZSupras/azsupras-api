import { AppConfigService } from './app-config.service';
import { AppConfig } from './entities/app-config.entity';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { DeleteResult } from 'typeorm';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { User } from '@/user/entities/user.entity';
import { AppConfigWithUserSessionDto } from './dto/app-config-with-user-session.dto';
export declare class AppConfigController {
    private readonly appConfigService;
    private readonly logger;
    constructor(appConfigService: AppConfigService);
    getLatestConfig(user: User): Promise<IResponseWithRelation<AppConfigWithUserSessionDto>>;
    getAllConfigs(): Promise<IResponseWithRelation<AppConfig[]>>;
    upsert(createAppConfigDto: CreateAppConfigDto): Promise<IResponseWithRelation<AppConfig>>;
    delete(id: string): Promise<IResponseWithRelation<DeleteResult>>;
}
