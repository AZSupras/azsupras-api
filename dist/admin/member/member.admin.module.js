"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMemberModule = void 0;
const common_1 = require("@nestjs/common");
const member_admin_controller_1 = require("./member.admin.controller");
const member_admin_service_1 = require("./member.admin.service");
const member_photo_entity_1 = require("../../member/entities/member-photo.entity");
const member_vehicle_entity_1 = require("../../member/entities/member-vehicle.entity");
const member_entity_1 = require("../../member/entities/member.entity");
const typeorm_1 = require("@nestjs/typeorm");
const s3_module_1 = require("../../s3/s3.module");
let AdminMemberModule = class AdminMemberModule {
};
exports.AdminMemberModule = AdminMemberModule;
exports.AdminMemberModule = AdminMemberModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([member_entity_1.Member, member_photo_entity_1.MemberPhoto, member_vehicle_entity_1.MemberVehicle]),
            s3_module_1.S3Module,
        ],
        providers: [member_admin_service_1.AdminMemberService],
        controllers: [
            member_admin_controller_1.AdminMemberController,
        ],
        exports: [member_admin_service_1.AdminMemberService, typeorm_1.TypeOrmModule],
    })
], AdminMemberModule);
//# sourceMappingURL=member.admin.module.js.map