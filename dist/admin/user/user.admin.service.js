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
var AdminUserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const logger_service_1 = require("../../logger/logger.service");
const user_role_entity_1 = require("../../user/entities/user-role.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_2 = require("typeorm");
let AdminUserService = AdminUserService_1 = class AdminUserService {
    constructor(userRepo, roleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.logger = new logger_service_1.LoggerService(AdminUserService_1.name);
    }
    async find(query) {
        const results = await this.userRepo.find(query);
        return results;
    }
    async findOne(query) {
        const results = await this.userRepo.findOne(query);
        return results;
    }
    async findAll() {
        const results = await this.userRepo.find();
        return results;
    }
    async findOneByUsername(username) {
        const results = await this.userRepo.findOne({
            where: {
                username
            }
        });
        return results;
    }
    async banUser({ username, reason }) {
        if (!username) {
            throw new common_1.NotFoundException(`User not found.`);
        }
        if (!reason) {
            reason = 'No reason provided.';
        }
        const user = await this.findOneByUsername(username);
        if (!user) {
            throw new common_1.NotFoundException(`User '${username}' not found.`);
        }
        user.isBanned = true;
        user.bannedAt = new Date();
        user.bannedReason = reason;
        const bannedUser = await this.userRepo.save(user);
        return bannedUser;
    }
    async unbanUser(username) {
        const user = await this.findOneByUsername(username);
        if (!user) {
            throw new common_1.NotFoundException(`User '${username}' not found.`);
        }
        user.isBanned = false;
        user.bannedAt = null;
        user.bannedReason = null;
        const unbannedUser = await this.userRepo.save(user);
        return unbannedUser;
    }
};
exports.AdminUserService = AdminUserService;
exports.AdminUserService = AdminUserService = AdminUserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminUserService);
//# sourceMappingURL=user.admin.service.js.map