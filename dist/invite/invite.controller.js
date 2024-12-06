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
exports.InviteController = void 0;
const common_1 = require("@nestjs/common");
const invite_service_1 = require("./invite.service");
const is_admin_guard_1 = require("../auth/guards/is-admin.guard");
const is_authenticated_guard_1 = require("../auth/guards/is-authenticated.guard");
let InviteController = class InviteController {
    constructor(inviteService) {
        this.inviteService = inviteService;
    }
    async generate(count = 1) {
        const data = await this.inviteService.createMany(count);
        const response = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };
        return response;
    }
    async clearAll() {
        await this.inviteService.clearAll();
        return {
            statusCode: 200,
            message: 'Success',
        };
    }
    async findAll() {
        const data = await this.inviteService.findAll();
        const response = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };
        return response;
    }
    async findOneByCode(code) {
        const data = await this.inviteService.findOneByCode(code);
        const response = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return response;
    }
};
exports.InviteController = InviteController;
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)('generate'),
    __param(0, (0, common_1.Query)('count')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "generate", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)('clearall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "clearAll", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)(':code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "findOneByCode", null);
exports.InviteController = InviteController = __decorate([
    (0, common_1.Controller)('invite'),
    __metadata("design:paramtypes", [invite_service_1.InviteService])
], InviteController);
//# sourceMappingURL=invite.controller.js.map