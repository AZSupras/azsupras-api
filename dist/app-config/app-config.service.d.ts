import { DeleteResult, Repository } from 'typeorm';
import { AppConfig } from './entities/app-config.entity';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
export declare class AppConfigService {
    private repo;
    constructor(repo: Repository<AppConfig>);
    findAll(): Promise<AppConfig[]>;
    findOneById(id: string): Promise<AppConfig>;
    getLatest(): Promise<AppConfig>;
    upsert(newAppConfig: CreateAppConfigDto): Promise<AppConfig>;
    delete(id: string): Promise<DeleteResult>;
}
