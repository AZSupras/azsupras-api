"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteModule = void 0;
const common_1 = require("@nestjs/common");
const invite_service_1 = require("./invite.service");
const invite_controller_1 = require("./invite.controller");
const user_entity_1 = require("../user/entities/user.entity");
const bull_1 = require("@nestjs/bull");
const typeorm_1 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const invite_entity_1 = require("./invite.entity");
const hash_service_1 = require("../hash/hash.service");
let InviteModule = class InviteModule {
};
exports.InviteModule = InviteModule;
exports.InviteModule = InviteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([rxjs_1.Subscriber, invite_entity_1.Invite, user_entity_1.User]),
            bull_1.BullModule.registerQueue({
                name: 'email',
            }),
        ],
        providers: [invite_service_1.InviteService, hash_service_1.HashService],
        exports: [invite_service_1.InviteService, typeorm_1.TypeOrmModule],
        controllers: [invite_controller_1.InviteController],
    })
], InviteModule);
//# sourceMappingURL=invite.module.js.map