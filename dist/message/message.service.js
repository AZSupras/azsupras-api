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
var MessageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const message_entity_1 = require("./entities/message.entity");
const typeorm_1 = require("@nestjs/typeorm");
const logger_service_1 = require("../logger/logger.service");
const typeorm_2 = require("typeorm");
let MessageService = MessageService_1 = class MessageService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new logger_service_1.LoggerService(MessageService_1.name);
    }
    async findOne(query) {
        const result = await this.repo.findOne(query);
        return result;
    }
    async findMany(query) {
        const result = await this.repo.find(query);
        return result;
    }
    async create(data) {
        let result = this.repo.create(data);
        await this.repo.save(result);
        return result;
    }
    async update(id, data) {
        const result = await this.repo.save({ id, ...data });
        return result;
    }
    async toggleIsRead(id) {
        const message = await this.repo.findOne({
            where: {
                id
            }
        });
        if (!message) {
            throw new Error('Message not found');
        }
        message.isRead = !message.isRead;
        const result = await this.repo.save(message);
        return result;
    }
    async remove(id) {
        const message = await this.repo.findOne({
            where: {
                id
            }
        });
        if (!message) {
            throw new Error('Message not found');
        }
        const result = await this.repo.remove(message);
        return result;
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = MessageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessageService);
//# sourceMappingURL=message.service.js.map