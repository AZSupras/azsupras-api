import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CreateEmailDto } from './create-email.dto';
import { EmailService, ISentMessageInfo } from './email.service';
import { Email } from './email.entity';
import { Subscriber } from 'src/subscriber/subscriber.entity';
import { SubscriberService } from 'src/subscriber/subscriber.service';

@Processor('email')
export class EmailProcessor {
  private readonly log = new Logger(EmailProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly subscriberService: SubscriberService,
  ) {}

  @Process()
  async sendEmail(job: Job<CreateEmailDto>) {
    this.log.debug(`Processing job ${job.id}`);
    const createEmailDto: CreateEmailDto = job.data;
    let response: ISentMessageInfo = undefined;

    let email: Email = await this.emailService.findSubscribedByEmail(
      createEmailDto.to,
    );

    if (email) {
      this.log.debug(
        `Email with id ${email.id} already sent at ${email.sentAt} to ${email.to}`,
      );

      return;
    }

    email = await this.emailService.create(createEmailDto);

    switch (job.data.template) {
      case 'confirm_email':
        response = await this.emailService._sendConfirmEmail(job.data);
        break;
      case 'welcome':
        response = await this.emailService._sendWelcomeEmail(job.data);
        break;
      case 'newsletter_subscription':
        response = await this.emailService._sendNewsletterSubscription(
          job.data,
        );
        break;
      default:
        break;
    }

    email.response = response;
    email.sent = true;
    email.sentAt = new Date();

    const e: Email = await this.emailService.update(email.id, email);
    this.log.debug(`Email with id ${e.id} was sent at ${e.sentAt} to ${e.to}`);

    let subscriber: Subscriber = await this.subscriberService.findOneByEmail(
      email.to,
    );

    if (!subscriber) {
      throw new Error('No subscriber found');
    }

    subscriber.subscribeEmailSentAt = email.sentAt;
    subscriber = await this.subscriberService.update(subscriber.id, subscriber);
  }
}
