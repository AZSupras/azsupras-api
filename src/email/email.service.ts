import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './create-email.dto';
import { Repository } from 'typeorm';
import { Email } from './email.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface EmailVerification {
  userId: string;
}

export interface ISentMessageInfo {}

@Injectable()
export class EmailService {
  private readonly log = new Logger(EmailService.name);
  private readonly credentials = {
    host: this.configService.get<string>('MAIL_HOST'),
    port: this.configService.get<number>('MAIL_PORT'),
    user: this.configService.get<string>('MAIL_USERNAME'),
    pass: this.configService.get<string>('MAIL_PASSWORD'),
  };
  private sendingEmails = false;

  constructor(
    @InjectRepository(Email)
    private userRepo: Repository<Email>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private async _send(mail: ISendMailOptions): Promise<ISentMessageInfo> {
    try {
      const opts: ISendMailOptions = {
        from: this.configService.get<string>('MAIL_FROM'),
        to: mail.to,
        subject: mail.subject,
        template: mail.template,
        context: mail.context,
      };

      const results: ISentMessageInfo = await this.mailerService.sendMail(opts);
      console.log('results:', results);

      return results;
    } catch (error) {
      this.log.error(`Failed to send email: ${error.message}`);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // private async _generateEmailVerifyToken(userId: string) {
  //   let user: User = await this.userService.findOneById(userId);

  //   this.log.debug(`Generating email verification token for ${user.username}`);

  //   user.emailVerifyToken = crypto
  //     .createHash('sha1')
  //     .update(user.id + user.email)
  //     .digest('hex');

  //   user = await this.userService.update(user.id, user);

  //   return user;
  // }

  // send verification email
  public async sendConfirmEmail(
    mail: CreateEmailDto,
  ): Promise<ISentMessageInfo> {
    this.log.debug(`Sending confirmation email to ${mail.to}`);

    const baseUrl = this.configService.get<string>('API_BASE_URL');

    const confirmLink = `${baseUrl}/api/v1/auth/confirm-email?token=${mail.context.token}`;

    const opts: ISendMailOptions = {
      to: mail.to,
      subject: 'Email Confirmation',
      template: 'confirm_email',
      context: {
        username: mail.context.username,
        confirmLink: confirmLink,
      },
    };

    const results: ISentMessageInfo = await this._send(opts);

    return results;
  }

  // send welcome email
  public async sendWelcomeEmail(
    mail: CreateEmailDto,
  ): Promise<ISentMessageInfo> {
    this.log.debug(`Sending welcome email to ${mail.to}`);

    const opts: ISendMailOptions = {
      to: mail.to,
      subject: 'Welcome to our platform',
      template: 'welcome',
      context: {
        email: mail.to,
        firstName: mail.context.firstName,
        lastName: mail.context.lastName,
      },
    };

    const results: ISentMessageInfo = await this._send(opts);

    return results;
  }

  // send newsletter subscription email
  public async sendNewsletterSubscription(
    mail: CreateEmailDto,
  ): Promise<ISentMessageInfo> {
    this.log.debug(
      `Sending newsletter subscription email to ${mail.context.firstName} at ${mail.to}`,
    );
    const baseUrl = this.configService.get<string>('API_BASE_URL');

    const unsubscribeLink = `${baseUrl}/newsletter/unsubscribe?email=${mail.to}`;

    const opts: ISendMailOptions = {
      to: mail.to,
      subject: 'Newsletter Subscription',
      template: 'newsletter_subscription',
      context: {
        email: mail.to,
        firstName: mail.context.firstName || 'Gordon',
        lastName: mail.context.lastName,
        message: mail.context.message,
        unsubscribeLink: unsubscribeLink,
      },
    };

    const results: ISentMessageInfo = await this._send(opts);

    return results;
  }

  // get all unsent emails from the database, loop through them, and send them, then update the email record in the database that it was sent
  public async sendUnsentEmails(): Promise<void> {
    if (this.sendingEmails === true) {
      this.log.debug('Already sending emails');
      return;
    }

    this.sendingEmails = true;

    const unsentEmails: Email[] = await this.findUnsent();

    if (unsentEmails.length <= 0) {
      this.sendingEmails = false;
      this.log.debug('No unsent emails found');
      return;
    }

    this.log.debug(`Found ${unsentEmails.length} unsent emails`);

    for (const email of unsentEmails) {
      try {
        this.log.debug(
          `Sending ${email.template} email with id ${email.id} to ${email.to}`,
        );
        await this.setEmailSending(email.id);
        let response: ISentMessageInfo = {};

        switch (email.template) {
          case 'confirm_email':
            response = await this.sendConfirmEmail(email);
            break;
          case 'welcome':
            response = await this.sendWelcomeEmail(email);
            break;
          case 'newsletter_subscription':
            response = await this.sendNewsletterSubscription(email);
            break;
          default:
            break;
        }

        email.response = response;
        email.sent = true;
        email.sending = false;
        email.sentAt = new Date();
        const e: Email = await this.update(email.id, email);

        this.log.debug(
          `Email with id ${e.id} was sent at ${e.sentAt} to ${e.to}`,
        );
      } catch (error) {
        this.log.error(
          `Failed to send email with id ${email.id}: ${error.message}`,
        );
      }
    }
  }

  // create a new email in the database
  public async create(newEmail: CreateEmailDto): Promise<Email> {
    let email: Email = new Email();
    email.to = newEmail.to;
    email.subject = newEmail.subject;
    email.context = newEmail.context;
    email.template = newEmail.template;
    email = this.userRepo.create(email);

    await this.userRepo.save(email);

    return email;
  }

  // update an existing email in the database
  public async update(id: string, data: Email): Promise<Email> {
    let email: Email = await this.findOne(id);
    if (!email) {
      throw new Error('Email not found');
    }

    email = Object.assign(email, data);
    await this.userRepo.save(email);
    return email;
  }

  public async setEmailSent(id: string): Promise<Email> {
    const email: Email = await this.findOne(id);

    if (!email) {
      throw new Error('Email not found');
    }

    email.sent = true;
    email.sentAt = new Date();
    await this.userRepo.save(email);

    return email;
  }

  public async setEmailSending(id: string): Promise<Email> {
    const email: Email = await this.findOne(id);

    if (!email) {
      throw new Error('Email not found');
    }

    email.sending = true;
    await this.userRepo.save(email);

    return email;
  }

  // find one email by email id
  public async findOne(id: string): Promise<Email> {
    const results = await this.userRepo.findOne({
      where: {
        id: id,
      },
    });

    return results;
  }

  // find all emails
  public async findAll(): Promise<Email[]> {
    const results = await this.userRepo.find();

    return results;
  }

  // find first email sent to a particular email address
  public async findSubscribedByEmail(email: string): Promise<Email> {
    const results = await this.userRepo.findOne({
      where: { to: email, template: 'newsletter_subscription' },
    });

    return results;
  }

  // find all emails sent to a particular email address
  public async findAllSubscribedByEmail(email: string): Promise<Email[]> {
    const results = await this.userRepo.find({
      where: { to: email, template: 'newsletter_subscription' },
    });

    return results;
  }

  // find all emails sent to a particular email address
  public async findAllByEmail(email: string): Promise<Email[]> {
    const results = await this.userRepo.find({ where: { to: email } });

    return results;
  }

  // find all emails that have not been sent yet
  public async findUnsent(): Promise<Email[]> {
    const results = await this.userRepo.find({
      where: { sent: false, sending: false },
    });

    return results;
  }

  // find all emails that have been sent
  public async findSent(): Promise<Email[]> {
    const results = await this.userRepo.find({ where: { sent: true } });

    return results;
  }
}
