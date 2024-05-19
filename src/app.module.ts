import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import { ConfigModuleOptions, ConfigModule } from '@nestjs/config';
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
      entities: [Email, Subscriber],
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
    BullModule.registerQueue({
      name: 'email',
    }),
    AuthModule,
    UserModule,
    EmailModule,
    NewsletterModule,
    SubscriberModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    EmailService,
    UserService,
    SubscriberService,
    HashService,
  ],
})
export class AppModule {}
