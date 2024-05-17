import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import { ConfigModuleOptions, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerOptions, MailerModule } from '@nestjs-modules/mailer';

const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
};

const emailTemplatesDirectory = join(__dirname, '..', 'email/templates');

const mailerModuleOptions: MailerOptions = {
  transport: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  defaults: {
    from: '"noreply" <noreply@azsupras.club>',
  },
  template: {
    dir: emailTemplatesDirectory,
    adapter: new EjsAdapter(),
    options: {
      strict: true,
    },
  },
};

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRoot(mailerModuleOptions),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule {}
