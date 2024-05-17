import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './create-email.dto';

export interface EmailVerification {
  userId: string;
}

@Injectable()
export class EmailService {
  private readonly log = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private async _send(mail: CreateEmailDto) {
    this.mailerService.sendMail(mail);
  }
}
