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
exports.SubscriberService = void 0;
const common_1 = require("@nestjs/common");
const subscriber_entity_1 = require("./subscriber.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hash_service_1 = require("../hash/hash.service");
let SubscriberService = class SubscriberService {
    constructor(repo, hashService) {
        this.repo = repo;
        this.hashService = hashService;
    }
    async findAll() {
        const results = await this.repo.find();
        return results;
    }
    async findOneById(id) {
        const results = await this.repo.findOne({
            where: { id },
        });
        return results;
    }
    async findOneByEmail(email) {
        const results = await this.repo.findOne({ where: { email } });
        return results;
    }
    async create(newSubscriber) {
        let subscriber = new subscriber_entity_1.Subscriber();
        subscriber.email = newSubscriber.email;
        subscriber.firstName = newSubscriber.firstName;
        subscriber.lastName = newSubscriber.lastName;
        subscriber.subscribed = newSubscriber.subscribed;
        subscriber.unsubscribeToken = this.hashService.hashSync(subscriber.email);
        subscriber = this.repo.create(subscriber);
        await this.repo.save(subscriber);
        return subscriber;
    }
    async update(id, data) {
        let updatedSubscriber = await this.repo.findOne({
            where: { id },
        });
        if (!updatedSubscriber) {
            throw new Error('Subscriber not found');
        }
        updatedSubscriber.email = data.email || updatedSubscriber.email;
        updatedSubscriber.firstName = data.firstName || updatedSubscriber.firstName;
        updatedSubscriber.lastName = data.lastName || updatedSubscriber.lastName;
        updatedSubscriber = await this.repo.save(updatedSubscriber);
        return updatedSubscriber;
    }
    async subscribe(id) {
        let subscriber = await this.repo.findOne({
            where: { id },
        });
        if (!subscriber) {
            throw new Error('Subscriber not found');
        }
        if (subscriber.subscribed) {
            throw new Error('Subscriber already subscribed');
        }
        subscriber.subscribed = true;
        subscriber = await this.repo.save(subscriber);
        return subscriber;
    }
    async unsubscribe(id) {
        let subscriber = await this.repo.findOne({
            where: { id, subscribed: true },
        });
        if (!subscriber) {
            return null;
        }
        subscriber.subscribed = false;
        subscriber.unsubscribedAt = new Date();
        subscriber = await this.repo.save(subscriber);
        return subscriber;
    }
    async delete(id) {
        let subscriber = await this.repo.findOne({
            where: { id },
        });
        if (!subscriber) {
            throw new Error('Subscriber not found');
        }
        subscriber = await this.repo.remove(subscriber);
        return subscriber;
    }
    async clearAll() {
        await this.repo.clear();
    }
};
exports.SubscriberService = SubscriberService;
exports.SubscriberService = SubscriberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        hash_service_1.HashService])
], SubscriberService);
//# sourceMappingURL=subscriber.service.js.map