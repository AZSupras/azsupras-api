import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
export declare class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private connectedClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
