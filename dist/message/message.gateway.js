"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
let MessageGateway = class MessageGateway {
    constructor() {
        this.connectedClients = new Map();
    }
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            this.connectedClients.set(userId, client.id);
            client.join(`user_${userId}`);
            console.log(`handleConnection userId: ${userId} joined`);
        }
    }
    handleDisconnect(client) {
        const userId = client.handshake.query.userId;
        console.log(`handleDisconnect userId: ${userId} left`);
        if (userId) {
            this.connectedClients.delete(userId);
            client.leave(`user_${userId}`);
        }
    }
};
exports.MessageGateway = MessageGateway;
exports.MessageGateway = MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
    })
], MessageGateway);
//# sourceMappingURL=message.gateway.js.map