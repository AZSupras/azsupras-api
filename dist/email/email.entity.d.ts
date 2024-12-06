import { ISentMessageInfo } from './email.service';
import { Subscriber } from 'src/subscriber/subscriber.entity';
export declare class Email {
    id: string;
    to: string;
    template: string;
    subject?: string | null;
    context: string;
    response: ISentMessageInfo;
    sent: boolean;
    sending: boolean;
    sentAt: Date;
    error: string;
    errorAt: Date;
    errorStack: string;
    errorData: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    subscriber: Subscriber;
}
