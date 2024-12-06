import { Subscriber } from './subscriber.entity';
import { Repository } from 'typeorm';
import { CreateSubscriberDto, UpdateSubscriberDto } from './create-subscriber.dto';
import { HashService } from 'src/hash/hash.service';
export declare class SubscriberService {
    private repo;
    private hashService;
    constructor(repo: Repository<Subscriber>, hashService: HashService);
    findAll(): Promise<Subscriber[]>;
    findOneById(id: string): Promise<Subscriber>;
    findOneByEmail(email: string): Promise<Subscriber>;
    create(newSubscriber: CreateSubscriberDto): Promise<Subscriber>;
    update(id: string, data: UpdateSubscriberDto): Promise<Subscriber>;
    subscribe(id: string): Promise<Subscriber>;
    unsubscribe(id: string): Promise<Subscriber>;
    delete(id: string): Promise<Subscriber>;
    clearAll(): Promise<void>;
}
