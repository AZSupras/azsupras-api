"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_service_1 = require("./services/user.service");
const hash_service_1 = require("../hash/hash.service");
const user_role_entity_1 = require("./entities/user-role.entity");
const user_role_service_1 = require("./services/user-role.service");
const profile_controller_1 = require("./controllers/profile.controller");
const user_processor_1 = require("./user.processor");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_role_entity_1.UserRole,]),],
        providers: [user_service_1.UserService, user_role_service_1.UserRoleService, hash_service_1.HashService, user_processor_1.UserProcessor,],
        exports: [user_service_1.UserService, user_role_service_1.UserRoleService, user_processor_1.UserProcessor, typeorm_1.TypeOrmModule],
        controllers: [profile_controller_1.ProfileController],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map