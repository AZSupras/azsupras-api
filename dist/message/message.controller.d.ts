import { MessageService } from './message.service';
import { User } from '@/user/entities/user.entity';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Socket } from 'socket.io';
export declare class MessageController {
    private readonly messageService;
    private server;
    constructor(messageService: MessageService);
    getMyMessages(user: User, req: Request): Promise<IResponseWithRelation<Message[]>>;
    getMySentMessages(user: User, req: Request): Promise<IResponseWithRelation<Message[]>>;
    sendMessage(user: User, body: CreateMessageDto, client: Socket): Promise<IResponseWithRelation<Message>>;
}
