import { Email } from 'src/email/email.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Subscriber {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    subscribed: boolean;
    unsubscribeToken: string;
    unsubscribedAt: Date;
    subscribeEmailSentAt: Date;
    unsubscribeEmailSentAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    emails: Email[];
    user: User;
}
