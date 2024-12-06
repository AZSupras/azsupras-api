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
exports.AdminUserController = void 0;
const common_1 = require("@nestjs/common");
const is_authenticated_guard_1 = require("../../auth/guards/is-authenticated.guard");
const is_admin_guard_1 = require("../../auth/guards/is-admin.guard");
const user_admin_service_1 = require("./user.admin.service");
const ban_user_dto_1 = require("../dto/ban-user.dto");
let AdminUserController = class AdminUserController {
    constructor(userService) {
        this.userService = userService;
    }
    async Admin_getAll() {
        const data = await this.userService.find({
            relations: {
                roles: true,
            }
        });
        const results = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };
        return results;
    }
    async Admin_getOneByUsername(username) {
        const data = await this.userService.findOneByUsername(username);
        const results = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return results;
    }
    async Admin_banUser(banUser) {
        if (!banUser.username) {
            throw new Error('You must provide a username to ban');
        }
        if (!banUser.reason) {
            throw new Error('You must provide a reason for the ban');
        }
        if (banUser.username === 'admin') {
            throw new Error('You cannot ban the admin user');
        }
        let data = await this.userService.findOneByUsername(banUser.username);
        if (!data) {
            throw new Error('User not found');
        }
        if (data.isBanned) {
            return {
                statusCode: 200,
                message: 'User is already banned',
                data,
            };
        }
        data =
            await this.userService.banUser(banUser);
        const results = {
            statusCode: 200,
            message: 'Successfully banned user',
            data,
        };
        return results;
    }
    async Admin_unbanUser(banUser) {
        if (!banUser.username) {
            throw new Error('You must provide a username to unban');
        }
        let data = await this.userService.findOneByUsername(banUser.username);
        if (!data) {
            throw new Error('User not found');
        }
        if (!data.isBanned) {
            return {
                statusCode: 200,
                message: 'User is not banned',
                data,
            };
        }
        data =
            await this.userService.unbanUser(banUser.username);
        const results = {
            statusCode: 200,
            message: 'Successfully unbanned user',
            data,
        };
        return results;
    }
};
exports.AdminUserController = AdminUserController;
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "Admin_getAll", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)(':username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "Admin_getOneByUsername", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Post)('ban'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ban_user_dto_1.BanUserDto]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "Admin_banUser", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Post)('unban'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ban_user_dto_1.UnbanUserDto]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "Admin_unbanUser", null);
exports.AdminUserController = AdminUserController = __decorate([
    (0, common_1.Controller)(['admin/user', 'admin/users']),
    __metadata("design:paramtypes", [user_admin_service_1.AdminUserService])
], AdminUserController);
//# sourceMappingURL=user.admin.controller.js.map