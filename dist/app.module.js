"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const logger_service_1 = require("./logger/logger.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const mailer_1 = require("@nestjs-modules/mailer");
const user_service_1 = require("./user/services/user.service");
const user_module_1 = require("./user/user.module");
const email_service_1 = require("./email/email.service");
const newsletter_module_1 = require("./newsletter/newsletter.module");
const email_entity_1 = require("./email/email.entity");
const email_module_1 = require("./email/email.module");
const bull_1 = require("@nestjs/bull");
const subscriber_module_1 = require("./subscriber/subscriber.module");
const subscriber_entity_1 = require("./subscriber/subscriber.entity");
const subscriber_service_1 = require("./subscriber/subscriber.service");
const hash_service_1 = require("./hash/hash.service");
const invite_module_1 = require("./invite/invite.module");
const seeder_module_1 = require("./seeder/seeder.module");
const hash_module_1 = require("./hash/hash.module");
const seeder_service_1 = require("./seeder/seeder.service");
const user_entity_1 = require("./user/entities/user.entity");
const user_role_entity_1 = require("./user/entities/user-role.entity");
const app_config_module_1 = require("./app-config/app-config.module");
const logger_module_1 = require("./logger/logger.module");
const auth_module_1 = require("./auth/auth.module");
const terminus_1 = require("@nestjs/terminus");
const health_controller_1 = require("./health/health.controller");
const health_module_1 = require("./health/health.module");
const app_controller_1 = require("./app.controller");
const admin_controller_1 = require("./admin/admin.controller");
const admin_module_1 = require("./admin/admin.module");
const help_module_1 = require("./help/help.module");
const schedule_1 = require("@nestjs/schedule");
const configModuleOptions = {
    isGlobal: true,
    envFilePath: ['.env', '.env.local'],
};
const emailTemplatesDirectory = (0, path_1.join)(__dirname, 'email/templates');
console.log('emailTemplatesDirectory:', emailTemplatesDirectory);
const schedulerConfig = {
    name: 'azsupras:scheduler',
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT) || 6379,
        db: 0,
    }
};
let AppModule = AppModule_1 = class AppModule {
    constructor(seederService, configService) {
        this.seederService = seederService;
        this.configService = configService;
        this.logger = new logger_service_1.LoggerService(AppModule_1.name);
    }
    async onModuleInit() {
        const seedDatabase = this.configService.get('SEED_DATABASE') || 'false';
        if (seedDatabase === 'true') {
            await this.seederService.run();
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            terminus_1.TerminusModule,
            config_1.ConfigModule.forRoot(configModuleOptions),
            logger_module_1.LoggerModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                autoLoadEntities: true,
                entities: [email_entity_1.Email, subscriber_entity_1.Subscriber, user_entity_1.User, user_role_entity_1.UserRole,],
                synchronize: true,
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 587,
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                    },
                },
                defaults: {
                    from: process.env.MAIL_FROM || '"noreply" <noreply@azsupras.club>',
                },
                template: {
                    dir: emailTemplatesDirectory,
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: false,
                    },
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
            bull_1.BullModule.forRoot(schedulerConfig),
            user_module_1.UserModule,
            email_module_1.EmailModule,
            newsletter_module_1.NewsletterModule,
            subscriber_module_1.SubscriberModule,
            invite_module_1.InviteModule,
            seeder_module_1.SeederModule,
            hash_module_1.HashModule,
            app_config_module_1.AppConfigModule,
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            admin_module_1.AdminModule,
            help_module_1.HelpModule,
        ],
        providers: [
            app_service_1.AppService,
            seeder_service_1.SeederService,
            logger_service_1.LoggerService,
            email_service_1.EmailService,
            user_service_1.UserService,
            subscriber_service_1.SubscriberService,
            hash_service_1.HashService,
        ],
        controllers: [health_controller_1.HealthController, app_controller_1.AppController, admin_controller_1.AdminController],
    }),
    __metadata("design:paramtypes", [seeder_service_1.SeederService,
        config_1.ConfigService])
], AppModule);
//# sourceMappingURL=app.module.js.map