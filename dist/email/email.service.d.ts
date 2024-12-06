import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './create-email.dto';
import { Repository } from 'typeorm';
import { Email } from './email.entity';
import { UserService } from 'src/user/services/user.service';
export interface EmailVerification {
    userId: string;
}
export interface ISentMessageInfo {
}
export declare class EmailService {
    private repo;
    private readonly mailerService;
    private readonly configService;
    private readonly userService;
    private readonly log;
    private readonly credentials;
    private sendingEmails;
    constructor(repo: Repository<Email>, mailerService: MailerService, configService: ConfigService, userService: UserService);
    private _send;
    sendConfirmEmail(mail: CreateEmailDto): Promise<ISentMessageInfo>;
    sendWelcomeEmail(mail: CreateEmailDto): Promise<ISentMessageInfo>;
    sendNewsletterSubscription(mail: CreateEmailDto): Promise<ISentMessageInfo>;
    sendPasswordReset(mail: CreateEmailDto): Promise<ISentMessageInfo>;
    sendUnsentEmails(): Promise<void>;
    create(newEmail: CreateEmailDto): Promise<Email>;
    update(id: string, data: Email): Promise<Email>;
    setEmailSent(id: string): Promise<Email>;
    setEmailSending(id: string): Promise<Email>;
    findOne(id: string): Promise<Email>;
    findAll(): Promise<Email[]>;
    findSubscribedByEmail(email: string): Promise<Email>;
    findAllSubscribedByEmail(email: string): Promise<Email[]>;
    findAllByEmail(email: string): Promise<Email[]>;
    findUnsent(): Promise<Email[]>;
    findSent(): Promise<Email[]>;
    clearAll(): Promise<void>;
}
