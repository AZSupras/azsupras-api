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
exports.UserRoleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_role_entity_1 = require("../entities/user-role.entity");
let UserRoleService = class UserRoleService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(roleData) {
        const role = this.repo.create(roleData);
        return this.repo.save(role);
    }
    async findAll() {
        return this.repo.find();
    }
    async findManyBySlugs(slugs) {
        return await this.repo
            .createQueryBuilder('roles')
            .where('roles.slug IN (:...slugs)', { slugs })
            .getMany();
    }
    async findOneById(id) {
        const role = await this.repo.findOne({
            where: {
                id,
            },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }
    async findOneBySlug(slug) {
        const role = await this.repo.findOne({
            where: {
                slug,
            },
        });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${slug} not found`);
        }
        return role;
    }
    async update(id, updateData) {
        await this.repo.update(id, updateData);
        const updatedRole = await this.repo.findOne({
            where: {
                id,
            },
        });
        if (!updatedRole) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return updatedRole;
    }
    async remove(id) {
        const result = await this.repo.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
    }
    async clearAll() {
        await this.repo.clear();
    }
};
exports.UserRoleService = UserRoleService;
exports.UserRoleService = UserRoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRoleService);
//# sourceMappingURL=user-role.service.js.map