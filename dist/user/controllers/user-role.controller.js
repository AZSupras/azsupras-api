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
exports.UserRoleController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const user_entity_1 = require("../entities/user.entity");
const user_decorator_1 = require("../decorators/user.decorator");
const is_authenticated_guard_1 = require("../../auth/guards/is-authenticated.guard");
const is_admin_guard_1 = require("../../auth/guards/is-admin.guard");
const user_role_service_1 = require("../services/user-role.service");
let UserRoleController = class UserRoleController {
    constructor(userService, userRoleService) {
        this.userService = userService;
        this.userRoleService = userRoleService;
    }
    async getAll(user) {
        const data = await this.userRoleService.findAll();
        const results = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };
        return results;
    }
    async getOneBySlug(slug) {
        const data = await this.userRoleService.findOneBySlug(slug);
        const results = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return results;
    }
    async getOneById(id) {
        const data = await this.userRoleService.findOneById(id);
        const results = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return results;
    }
};
exports.UserRoleController = UserRoleController;
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "getOneBySlug", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "getOneById", null);
exports.UserRoleController = UserRoleController = __decorate([
    (0, common_1.Controller)(['role']),
    __metadata("design:paramtypes", [user_service_1.UserService, user_role_service_1.UserRoleService])
], UserRoleController);
//# sourceMappingURL=user-role.controller.js.map