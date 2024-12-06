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
exports.SubscriberController = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const hash_service_1 = require("../hash/hash.service");
const create_subscriber_dto_1 = require("./create-subscriber.dto");
const subscriber_service_1 = require("./subscriber.service");
let SubscriberController = class SubscriberController {
    constructor(subscriberService, hashService, emailQueue) {
        this.subscriberService = subscriberService;
        this.hashService = hashService;
        this.emailQueue = emailQueue;
    }
    async unsubscribe(email, token) {
        let subscriber = await this.subscriberService.findOneByEmail(email);
        if (!subscriber) {
            const response = {
                statusCode: 404,
                message: 'Subscriber not found',
                data: null,
            };
            return response;
        }
        if (subscriber.unsubscribeToken !== token) {
            const response = {
                statusCode: 400,
                message: 'Invalid token',
                data: null,
            };
            return response;
        }
        subscriber = await this.subscriberService.unsubscribe(subscriber.id);
        const response = {
            statusCode: 200,
            message: 'Unsubscribed successfully',
            data: subscriber,
        };
        return response;
    }
    async subscribe(req, newsletterSubscribeDto) {
        let subscriber = await this.subscriberService.findOneByEmail(newsletterSubscribeDto.email);
        if (subscriber) {
            const response = {
                statusCode: 400,
                message: 'Email already subscribed, check your email inbox and spam folder.',
                data: null,
            };
            return response;
        }
        subscriber = await this.subscriberService.create({
            email: newsletterSubscribeDto.email,
            firstName: newsletterSubscribeDto.firstName,
            lastName: newsletterSubscribeDto.lastName,
            subscribed: true,
        });
        this.emailQueue.add({
            to: newsletterSubscribeDto.email,
            subject: 'Newsletter Subscription',
            template: 'newsletter_subscription',
            context: {
                email: newsletterSubscribeDto.email,
                token: this.hashService.hashSync(subscriber.email),
                firstName: newsletterSubscribeDto.firstName,
                lastName: newsletterSubscribeDto.lastName,
            },
        });
        const response = {
            statusCode: 201,
            message: 'Subscription successful',
            data: subscriber,
        };
        return response;
    }
};
exports.SubscriberController = SubscriberController;
__decorate([
    (0, common_1.Get)('unsubscribe'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriberController.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_subscriber_dto_1.CreateSubscriberDto]),
    __metadata("design:returntype", Promise)
], SubscriberController.prototype, "subscribe", null);
exports.SubscriberController = SubscriberController = __decorate([
    (0, common_1.Controller)('subscriber'),
    __param(2, (0, bull_1.InjectQueue)('email')),
    __metadata("design:paramtypes", [subscriber_service_1.SubscriberService,
        hash_service_1.HashService, Object])
], SubscriberController);
//# sourceMappingURL=subscriber.controller.js.map