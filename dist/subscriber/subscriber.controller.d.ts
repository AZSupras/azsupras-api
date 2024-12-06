import { Queue } from 'bull';
import { HashService } from 'src/hash/hash.service';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { CreateSubscriberDto } from './create-subscriber.dto';
import { SubscriberService } from './subscriber.service';
import { Subscriber } from './subscriber.entity';
export declare class SubscriberController {
    private readonly subscriberService;
    private readonly hashService;
    private emailQueue;
    constructor(subscriberService: SubscriberService, hashService: HashService, emailQueue: Queue);
    unsubscribe(email: string, token: string): Promise<IResponseWithRelation<Subscriber>>;
    subscribe(req: any, newsletterSubscribeDto: CreateSubscriberDto): Promise<IResponseWithRelation<Subscriber>>;
}
