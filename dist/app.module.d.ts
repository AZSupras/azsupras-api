import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeederService } from './seeder/seeder.service';
export declare class AppModule implements OnModuleInit {
    private readonly seederService;
    private readonly configService;
    private readonly logger;
    constructor(seederService: SeederService, configService: ConfigService);
    onModuleInit(): Promise<void>;
}
