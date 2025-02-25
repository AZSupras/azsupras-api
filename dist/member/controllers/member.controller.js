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
exports.MemberController = void 0;
const common_1 = require("@nestjs/common");
const member_service_1 = require("../services/member.service");
const update_member_dto_1 = require("../dto/update-member.dto");
const is_authenticated_guard_1 = require("../../auth/guards/is-authenticated.guard");
const s3_service_1 = require("../../s3/s3.service");
const user_decorator_1 = require("../../user/decorators/user.decorator");
const user_entity_1 = require("../../user/entities/user.entity");
let MemberController = class MemberController {
    constructor(memberService, s3Service) {
        this.memberService = memberService;
        this.s3Service = s3Service;
    }
    async findAll() {
        const data = await this.memberService.findAll()
            .then((members) => {
            return members.map((member) => {
                return {
                    ...member,
                    photo: member.photo ? member.photo.url : null,
                };
            });
        });
        const response = {
            data: data,
            statusCode: 200,
            message: 'Members fetched successfully',
        };
        return response;
    }
    async getMyMember(user) {
        const data = await this.memberService.findOne({ where: { userId: user.id }, relations: ['user'] });
        if (!data) {
            const response = {
                statusCode: 404,
                message: 'Member not found',
            };
            return response;
        }
        const response = {
            data: data,
            statusCode: 200,
            message: 'Member fetched successfully',
        };
        return response;
    }
    async upsertMyMemberProfile(user, updatesUser) {
        const data = await this.memberService.upsert({ ...updatesUser, user: user, userId: user.id });
        const response = {
            data: data,
            statusCode: 200,
            message: 'Member created successfully',
        };
        return response;
    }
    async getSingleMemberById(id) {
        const data = await this.memberService.findOneById(id);
        const response = {
            data: data,
            statusCode: 200,
            message: 'Member fetched successfully',
        };
        return response;
    }
    async getMemberVehicles(id) {
        const data = await this.memberService.getMemberVehicles(id);
        const response = {
            data: data,
            statusCode: 200,
            message: 'Member vehicles fetched successfully',
        };
        return response;
    }
};
exports.MemberController = MemberController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getMyMember", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, update_member_dto_1.UpdateMemberDto]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "upsertMyMemberProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getSingleMemberById", null);
__decorate([
    (0, common_1.Get)(':id/vehicles'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getMemberVehicles", null);
exports.MemberController = MemberController = __decorate([
    (0, common_1.Controller)(['member', 'members']),
    __metadata("design:paramtypes", [member_service_1.MemberService, s3_service_1.S3Service])
], MemberController);
//# sourceMappingURL=member.controller.js.map