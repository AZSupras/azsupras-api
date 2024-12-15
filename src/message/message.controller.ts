import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { IsAuthenticatedGuard } from '@/auth/guards/is-authenticated.guard';
import { AuthUser } from '@/user/decorators/user.decorator';
import { User } from '@/user/entities/user.entity';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ApiBearerAuth } from '@nestjs/swagger';

@WebSocketGateway({
    cors: true, 
    // Enable CORS for WebSocket connections
})
@ApiBearerAuth()
@Controller(['message', 'messages'])
export class MessageController {
    @WebSocketServer()
    private server: Server;
    
    constructor(private readonly messageService: MessageService) {}

    @Get()
    @UseGuards(IsAuthenticatedGuard)
    @SubscribeMessage('getMyPrivateMessages')
    async getMyMessages(@AuthUser() user: User, @Req() req: Request): Promise<IResponseWithRelation<Message[]>> {
        const data: Message[] = await this.messageService.findMany({
            where: {
                recipientId: user.id,
            },
            relations: ['sender', 'recipient'],
            order: {
                createdAt: 'DESC',
            },
        });

        const results: IResponseWithRelation<Message[]> = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };

        return results;
    }

    @Get('sent')
    @UseGuards(IsAuthenticatedGuard)
    async getMySentMessages(@AuthUser() user: User, @Req() req: Request): Promise<IResponseWithRelation<Message[]>> {
        const data: Message[] = await this.messageService.findMany({
            where: {
                senderId: user.id,
            },
            relations: ['sender', 'recipient'],
            order: {
                createdAt: 'DESC',
            },
        });

        const results: IResponseWithRelation<Message[]> = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };

        return results;
    }

    @Post('send')
    @UseGuards(IsAuthenticatedGuard)
    async sendMessage(@AuthUser() user: User, @Body() body: CreateMessageDto,
    @ConnectedSocket() client: Socket,): Promise<IResponseWithRelation<Message>> {
        body.senderId = user.id;

        try {
            const data: Message = await this.messageService.create(body);
            if (!data) {
                throw new BadRequestException('Failed to send message');
            }

            // Emit a WebSocket event to notify the recipient
            client.emit('newMessage', {
                message: data,
                sender: user,
            });

            const results: IResponseWithRelation<Message> = {
                statusCode: 200,
                message: 'Success',
                data,
            };

            return results;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}

