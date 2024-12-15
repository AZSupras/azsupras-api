import { Message } from './entities/message.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessageService {
    private repo;
    private readonly logger;
    constructor(repo: Repository<Message>);
    findOne(query: FindOneOptions<Message>): Promise<Message>;
    findMany(query?: FindManyOptions<Message>): Promise<Message[]>;
    create(data: CreateMessageDto): Promise<Message>;
    update(id: string, data: Partial<Message>): Promise<Message>;
    toggleIsRead(id: string): Promise<Message>;
    remove(id: string): Promise<Message>;
}
