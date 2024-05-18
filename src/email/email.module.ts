import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './email.entity';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Email]), ConfigModule, MailerModule],
  providers: [EmailService],
  exports: [EmailService, TypeOrmModule],
  controllers: [EmailController],
})
export class EmailModule {}
