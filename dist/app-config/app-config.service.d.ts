import { DeleteResult, Repository } from 'typeorm';
import { AppConfig } from './app-config.entity';
export declare class AppConfigService {
    private repo;
    constructor(repo: Repository<AppConfig>);
    findAll(): Promise<AppConfig[]>;
    findOneById(id: string): Promise<AppConfig>;
    getLatest(): Promise<AppConfig>;
    upsert(newAppConfig: Partial<AppConfig>): Promise<AppConfig>;
    delete(id: string): Promise<DeleteResult>;
}
