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
const s3_service_1 = require("../../s3/s3.service");
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
exports.MemberController = MemberController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('vehicles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getAllVehicles", null);
__decorate([
    (0, common_1.Get)(':id/vehicles'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getMemberVehicles", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "findOne", null);
exports.MemberController = MemberController = __decorate([
    (0, common_1.Controller)(['member', 'members']),
    __metadata("design:paramtypes", [member_service_1.MemberService, s3_service_1.S3Service])
], MemberController);
//# sourceMappingURL=member.controller.js.map