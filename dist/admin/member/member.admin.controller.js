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
exports.AdminMemberController = void 0;
const common_1 = require("@nestjs/common");
const create_member_dto_1 = require("../../member/dto/create-member.dto");
const update_member_dto_1 = require("../../member/dto/update-member.dto");
const is_admin_guard_1 = require("../../auth/guards/is-admin.guard");
const is_authenticated_guard_1 = require("../../auth/guards/is-authenticated.guard");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("../../s3/s3.service");
const member_admin_service_1 = require("./member.admin.service");
let AdminMemberController = class AdminMemberController {
    constructor(memberService, s3Service) {
        this.memberService = memberService;
        this.s3Service = s3Service;
    }
    async findAll() {
        const data = await this.memberService.findAll();
        const response = {
            data: data,
            statusCode: 200,
            message: 'Members fetched successfully',
        };
        return response;
    }
    async create(createMemberDto) {
        try {
            const data = await this.memberService.create(createMemberDto);
            const response = {
                data: data,
                statusCode: 200,
                message: 'Member created successfully',
            };
            return response;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async update(id, updateMemberDto) {
        const data = await this.memberService.update(id, updateMemberDto);
        const response = {
            data: data,
            statusCode: 200,
            message: 'Member updated successfully',
        };
        return response;
    }
    async getAllVehicles() {
        const data = await this.memberService.getAllVehicles();
        const response = {
            data: data,
            statusCode: 200,
            message: 'Member vehicles fetched successfully',
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
    async remove(id) {
        const data = await this.memberService.remove(id);
        const response = {
            data: data,
            statusCode: 200,
            message: 'Member deleted successfully',
        };
        return response;
    }
    async addPhoto(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        if (!id) {
            throw new common_1.BadRequestException('Member ID is required');
        }
        try {
            const existingPhoto = await this.memberService.getMemberPhoto(id);
            if (existingPhoto) {
                await this.memberService.removeMemberPhoto(id);
                await this.s3Service.deleteFile(existingPhoto.url);
            }
            const uploadedFile = await this.s3Service.uploadFile(file, `members/${id}/photo`);
            const addPhotoDto = {
                memberId: id,
                url: uploadedFile.Location,
            };
            const data = await this.memberService.createPhoto(addPhotoDto);
            const response = {
                data: data,
                statusCode: 200,
                message: 'Member photo uploaded successfully',
            };
            return response;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findOne(id) {
        const data = await this.memberService.findOneById(id);
        const response = {
            data: data,
            statusCode: 200,
            message: 'Member fetched successfully',
        };
        return response;
    }
};
exports.AdminMemberController = AdminMemberController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminMemberController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_member_dto_1.CreateMemberDto]),
    __metadata("design:returntype", Promise)
], AdminMemberController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_member_dto_1.UpdateMemberDto]),
    __metadata("design:returntype", Promise)
], AdminMemberController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('vehicles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminMemberController.prototype, "getAllVehicles", null);
__decorate([
    (0, common_1.Get)(':id/vehicles'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminMemberController.prototype, "getMemberVehicles", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminMemberController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/photo/upload'),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminMemberController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminMemberController.prototype, "findOne", null);
exports.AdminMemberController = AdminMemberController = __decorate([
    (0, common_1.Controller)(['admin/member', 'admin/members']),
    __metadata("design:paramtypes", [member_admin_service_1.AdminMemberService, s3_service_1.S3Service])
], AdminMemberController);
//# sourceMappingURL=member.admin.controller.js.map