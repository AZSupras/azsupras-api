import { Module, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import {
  ConfigModuleOptions,
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { EmailService } from './email/email.service';
import { NewsletterModule } from './newsletter/newsletter.module';
import { Email } from './email/email.entity';
import { EmailModule } from './email/email.module';
import { BullModule } from '@nestjs/bull';
import { SubscriberModule } from './subscriber/subscriber.module';
import { Subscriber } from './subscriber/subscriber.entity';
import { SubscriberService } from './subscriber/subscriber.service';
import { HashService } from './hash/hash.service';
import { InviteModule } from './invite/invite.module';
import { SeederModule } from './seeder/seeder.module';
import { HashModule } from './hash/hash.module';
import { UserRoleModule } from './user-role/user-role.module';
import { SeederService } from './seeder/seeder.service';
import { User } from './user/user.entity';
import { UserRole } from './user-role/user-role.entity';
import { AppConfigModule } from './app-config/app-config.module';

const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
};

const emailTemplatesDirectory = join(__dirname, 'email/templates');
console.log('emailTemplatesDirectory:', emailTemplatesDirectory);

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      entities: [Email, Subscriber, User, UserRole],
      synchronize: true,
    }),
    MailerModule.forRoot({
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
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    AuthModule,
    UserModule,
    EmailModule,
    NewsletterModule,
    SubscriberModule,
    InviteModule,
    SeederModule,
    HashModule,
    UserRoleModule,
    AppConfigModule,
  ],
  providers: [
    AppService,
    SeederService,
    LoggerService,
    EmailService,
    UserService,
    SubscriberService,
    HashService,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new LoggerService(AppModule.name);
  constructor(
    private readonly seederService: SeederService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const seedDatabase =
      this.configService.get<string>('SEED_DATABASE') || 'false';

    if (seedDatabase === 'true') {
      await this.seederService.run();
    }
  }
}
