import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { AppConfig } from './app-config.entity';
import { CreateAppConfigDto } from './dto/create-app-config.dto';

@Injectable()
export class AppConfigService {
    constructor(
        @InjectRepository(AppConfig)
        private repo: Repository<AppConfig>,
    ) {}

    public async findAll(): Promise<AppConfig[]> {
        const results: AppConfig[] = await this.repo.find({
            order: {
                createdAt: 'DESC',
            },
        });

        return results;
    }

    public async findOneById(id: string): Promise<AppConfig> {
        const result: AppConfig = await this.repo.findOne({
            where: { id },
        });

        return result;
    }

    public async getLatest(): Promise<AppConfig> {
        const result: AppConfig = await this.findAll()
            .then((configs: AppConfig[]) => {
                if (configs.length > 0) {
                    return configs[0];
                } else {
                    return null;
                }
            });

        return result;
    }

    // create a new app config
    private async _create(newAppConfig: CreateAppConfigDto): Promise<AppConfig> {
        let appConfig: AppConfig = new AppConfig();

        appConfig.appName = newAppConfig.appName;
        appConfig.registrationEnabled = newAppConfig.registrationEnabled;
        appConfig.emailVerificationRequired = newAppConfig.emailVerificationRequired;

        appConfig = this.repo.create(appConfig);

        await this.repo.save(appConfig);

        return appConfig;
    }

    public async upsert(newAppConfig: CreateAppConfigDto): Promise<AppConfig> {
        let existingConfig = await this.getLatest();

        if (existingConfig) {
            existingConfig.appName = newAppConfig.appName;
            existingConfig.registrationEnabled = newAppConfig.registrationEnabled;
            existingConfig.emailVerificationRequired = newAppConfig.emailVerificationRequired;

            await this.repo.update(existingConfig.id, existingConfig);

            return existingConfig;
        } else {
            return this._create(newAppConfig);
        }
    }

    public async delete(id: string): Promise<DeleteResult> {
        const deleteResults: DeleteResult = await this.repo.delete(id);

        return deleteResults;
    }
}
