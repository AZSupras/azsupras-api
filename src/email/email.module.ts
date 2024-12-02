import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './email.entity';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { SubscriberService } from 'src/subscriber/subscriber.service';
import { Subscriber } from 'src/subscriber/subscriber.entity';
import { HashService } from 'src/hash/hash.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email, Subscriber]),
    ConfigModule,
    MailerModule,
    UserModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailService, SubscriberService, HashService, EmailProcessor],
  exports: [EmailService, TypeOrmModule],
  controllers: [EmailController],
})
export class EmailModule {}
