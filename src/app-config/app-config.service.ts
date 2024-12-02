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
    const result: AppConfig = await this.findAll().then(
      (configs: AppConfig[]) => {
        if (configs.length > 0) {
          return configs[0];
        } else {
          return null;
        }
      },
    );

    return result;
  }

  public async upsert(newAppConfig: Partial<AppConfig>): Promise<AppConfig> {
    let existingConfig: AppConfig = await this.getLatest();

    if (existingConfig) {
      existingConfig = { ...existingConfig, ...newAppConfig };
      await this.repo.update(existingConfig.id, existingConfig);

      return existingConfig;
    } else {
      existingConfig = this.repo.create(newAppConfig);

      existingConfig = await this.repo.save(existingConfig);
      return existingConfig;
    }

  }

  public async delete(id: string): Promise<DeleteResult> {
    const deleteResults: DeleteResult = await this.repo.delete(id);

    return deleteResults;
  }
}
