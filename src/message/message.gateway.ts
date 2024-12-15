import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private connectedClients = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedClients.set(userId, client.id);
      client.join(`user_${userId}`);

      console.log(`handleConnection userId: ${userId} joined`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;

    console.log(`handleDisconnect userId: ${userId} left`);
    if (userId) {
      this.connectedClients.delete(userId);
      client.leave(`user_${userId}`);
    }
  }
}