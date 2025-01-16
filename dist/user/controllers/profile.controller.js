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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const user_update_dto_1 = require("../dto/user-update.dto");
const user_entity_1 = require("../entities/user.entity");
const user_service_1 = require("../services/user.service");
const public_guard_1 = require("../../auth/guards/public.guard");
const is_authenticated_guard_1 = require("../../auth/guards/is-authenticated.guard");
const user_decorator_1 = require("../decorators/user.decorator");
const swagger_1 = require("@nestjs/swagger");
let ProfileController = class ProfileController {
    constructor(userService) {
        this.userService = userService;
    }
    async getMe(user, req) {
        const data = user;
        const results = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return results;
    }
    async updateMe(user, updatesUser) {
        const data = await this.userService.update(user.username, updatesUser);
        const results = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return results;
    }
    async generateRandomUsername() {
        const data = this.userService.generateRandomUsername();
        const results = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return results;
    }
    async checkUsernameAvailability(username) {
        if (!username) {
            return {
                statusCode: 400,
                message: 'Username is required',
                data: false,
            };
        }
        if (username.length < 3) {
            return {
                statusCode: 400,
                message: 'Username must be at least 3 characters long',
                data: false,
            };
        }
        if (username.length > 20) {
            return {
                statusCode: 400,
                message: 'Username must be at most 20 characters long',
                data: false,
            };
        }
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            return {
                statusCode: 400,
                message: 'Username must contain only letters and numbers',
                data: false,
            };
        }
        if (username.includes(' ')) {
            return {
                statusCode: 400,
                message: 'Username must not contain spaces',
                data: false,
            };
        }
        const reservedWords = ['admin', 'moderator', 'system', 'support', 'help', 'root', 'administrator'];
        if (reservedWords.some(word => username.toLowerCase().includes(word))) {
            return {
                statusCode: 400,
                message: 'Username contains reserved words',
                data: false,
            };
        }
        const data = await this.userService.checkUsernameAvailability(username);
        const results = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return results;
    }
    async get(username) {
        const data = await this.userService.Public_findOneByUsername(username);
        if (!data) {
            return {
                statusCode: 404,
                message: 'User not found',
                data: null,
            };
        }
        const results = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return results;
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getMe", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, user_update_dto_1.UserUpdate]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('randomUsername'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "generateRandomUsername", null);
__decorate([
    (0, common_1.Get)('checkAvailable/:username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "checkUsernameAvailability", null);
__decorate([
    (0, public_guard_1.Public)(),
    (0, common_1.Get)(':username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "get", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)(['u', 'user', 'profile', 'p']),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [user_service_1.UserService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map