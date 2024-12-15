"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const is_authenticated_guard_1 = require("../auth/guards/is-authenticated.guard");
const user_decorator_1 = require("../user/decorators/user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const create_message_dto_1 = require("./dto/create-message.dto");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const swagger_1 = require("@nestjs/swagger");
let MessageController = class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    async getMyMessages(user, req) {
        const data = await this.messageService.findMany({
            where: {
                recipientId: user.id,
            },
            relations: ['sender', 'recipient'],
            order: {
                createdAt: 'DESC',
            },
        });
        const results = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };
        return results;
    }
    async getMySentMessages(user, req) {
        const data = await this.messageService.findMany({
            where: {
                senderId: user.id,
            },
            relations: ['sender', 'recipient'],
            order: {
                createdAt: 'DESC',
            },
        });
        const results = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };
        return results;
    }
    async sendMessage(user, body, client) {
        body.senderId = user.id;
        try {
            const data = await this.messageService.create(body);
            if (!data) {
                throw new common_1.BadRequestException('Failed to send message');
            }
            client.emit('newMessage', {
                message: data,
                sender: user,
            });
            const results = {
                statusCode: 200,
                message: 'Success',
                data,
            };
            return results;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageController.prototype, "server", void 0);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard),
    (0, websockets_1.SubscribeMessage)('getMyPrivateMessages'),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Request]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMyMessages", null);
__decorate([
    (0, common_1.Get)('sent'),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Request]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMySentMessages", null);
__decorate([
    (0, common_1.Post)('send'),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, create_message_dto_1.CreateMessageDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
exports.MessageController = MessageController = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(['message', 'messages']),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map