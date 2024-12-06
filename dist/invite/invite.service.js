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
exports.InviteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hash_service_1 = require("../hash/hash.service");
const typeorm_2 = require("typeorm");
const invite_entity_1 = require("./invite.entity");
const bull_1 = require("@nestjs/bull");
const crypto_1 = require("crypto");
let InviteService = class InviteService {
    constructor(repo, hashService, emailQueue) {
        this.repo = repo;
        this.hashService = hashService;
        this.emailQueue = emailQueue;
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
    async findOneByCode(code) {
        const results = await this.repo.findOne({ where: { code, used: false } });
        return results;
    }
    async create() {
        let invite = new invite_entity_1.Invite();
        invite.code = await this._generateUniqueCode(16);
        invite = this.repo.create(invite);
        await this.repo.save(invite);
        return invite;
    }
    _generateRandomAlphanumeric(length) {
        return (0, crypto_1.randomBytes)(length / 2).toString('hex');
    }
    async _isCodeUnique(code) {
        const count = await this.repo.count({ where: { code } });
        return count === 0;
    }
    async _generateUniqueCode(length = 16) {
        let code;
        do {
            code = this._generateRandomAlphanumeric(length);
        } while (!(await this._isCodeUnique(code)));
        return code;
    }
    async createMany(count) {
        const invites = [];
        for (let i = 0; i < count; i++) {
            const invite = new invite_entity_1.Invite();
            invite.code = await this._generateUniqueCode();
            invites.push(invite);
        }
        await this.repo.save(invites);
        return invites;
    }
    async update(id, data) {
        let updatedInvite = await this.repo.findOne({
            where: { id },
        });
        updatedInvite = this.repo.merge(updatedInvite, data);
        await this.repo.save(updatedInvite);
        return updatedInvite;
    }
    async use(id, user) {
        const invite = await this.repo.findOne({
            where: { id },
        });
        invite.used = true;
        invite.usedAt = new Date();
        invite.user = user;
        await this.repo.save(invite);
        return invite;
    }
    async delete(id) {
        const invite = await this.repo.findOne({
            where: { id },
        });
        await this.repo.delete(id);
        return invite;
    }
    async clearAll() {
        await this.repo.clear();
    }
};
exports.InviteService = InviteService;
exports.InviteService = InviteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invite_entity_1.Invite)),
    __param(2, (0, bull_1.InjectQueue)('email')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        hash_service_1.HashService, Object])
], InviteService);
//# sourceMappingURL=invite.service.js.map