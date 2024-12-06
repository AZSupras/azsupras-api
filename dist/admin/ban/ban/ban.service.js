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
exports.BanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ban_entity_1 = require("./ban.entity");
const user_entity_1 = require("../../../user/entities/user.entity");
const typeorm_2 = require("typeorm");
let BanService = class BanService {
    constructor(banRepo, userRepo) {
        this.banRepo = banRepo;
        this.userRepo = userRepo;
    }
    async findOne(id) {
        const ban = await this.banRepo.findOne({
            where: { id },
        });
        if (!ban) {
            throw new common_1.NotFoundException(`Ban with ID ${id} not found`);
        }
        return ban;
    }
    async findAll() {
        return this.banRepo.find();
    }
    async upsert(banData) {
        let ban = await this.banRepo.findOne({
            where: { id: banData.id },
        });
        if (ban) {
            ban = { ...ban, ...banData };
        }
        else {
            ban = this.banRepo.create(banData);
        }
        return this.banRepo.save(ban);
    }
    async delete(id) {
        const result = await this.banRepo.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Ban with ID ${id} not found`);
        }
    }
};
exports.BanService = BanService;
exports.BanService = BanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ban_entity_1.Ban)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BanService);
//# sourceMappingURL=ban.service.js.map