import { ConfigService } from '@nestjs/config';
import { HashService } from '@/hash/hash.service';
import { LoggerService } from '@/logger/logger.service';
import { UserRole } from '@/user/entities/user-role.entity';
import { User } from '@/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AppConfigService } from '@/app-config/app-config.service';
export declare class SeederService {
    private readonly userRepo;
    private readonly roleRepository;
    private readonly hashService;
    private readonly configService;
    private readonly appConfigService;
    private readonly logger;
    constructor(userRepo: Repository<User>, roleRepository: Repository<UserRole>, hashService: HashService, configService: ConfigService, appConfigService: AppConfigService, logger: LoggerService);
    upsertAppConfig(): Promise<void>;
    run(): Promise<void>;
    private _seedUserRoles;
    private _seedUsers;
    private _seedUserRole;
    private _seedUser;
}
