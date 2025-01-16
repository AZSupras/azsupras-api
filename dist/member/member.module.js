"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberModule = void 0;
const common_1 = require("@nestjs/common");
const member_service_1 = require("./services/member.service");
const member_controller_1 = require("./controllers/member.controller");
const typeorm_1 = require("@nestjs/typeorm");
const member_entity_1 = require("./entities/member.entity");
const member_photo_entity_1 = require("./entities/member-photo.entity");
const member_vehicle_entity_1 = require("./entities/member-vehicle.entity");
const s3_module_1 = require("../s3/s3.module");
let MemberModule = class MemberModule {
};
exports.MemberModule = MemberModule;
exports.MemberModule = MemberModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([member_entity_1.Member, member_photo_entity_1.MemberPhoto, member_vehicle_entity_1.MemberVehicle]),
            s3_module_1.S3Module,
        ],
        controllers: [member_controller_1.MemberController],
        providers: [member_service_1.MemberService],
        exports: [member_service_1.MemberService, typeorm_1.TypeOrmModule],
    })
], MemberModule);
//# sourceMappingURL=member.module.js.map