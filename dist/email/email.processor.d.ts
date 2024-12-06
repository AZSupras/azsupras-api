import { Job } from 'bull';
import { CreateEmailDto } from './create-email.dto';
import { EmailService } from './email.service';
import { SubscriberService } from 'src/subscriber/subscriber.service';
export declare class EmailProcessor {
    private readonly emailService;
    private readonly subscriberService;
    private readonly log;
    constructor(emailService: EmailService, subscriberService: SubscriberService);
    sendEmail(job: Job<CreateEmailDto>): Promise<void>;
}
