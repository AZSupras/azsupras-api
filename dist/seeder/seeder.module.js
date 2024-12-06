"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_role_entity_1 = require("../user/entities/user-role.entity");
const user_entity_1 = require("../user/entities/user.entity");
const seeder_service_1 = require("./seeder.service");
const hash_service_1 = require("../hash/hash.service");
const hash_module_1 = require("../hash/hash.module");
const app_config_module_1 = require("../app-config/app-config.module");
const logger_module_1 = require("../logger/logger.module");
let SeederModule = class SeederModule {
};
exports.SeederModule = SeederModule;
exports.SeederModule = SeederModule = __decorate([
    (0, common_1.Module)({
        imports: [
            hash_module_1.HashModule,
            logger_module_1.LoggerModule,
            app_config_module_1.AppConfigModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_role_entity_1.UserRole,]),
        ],
        providers: [hash_service_1.HashService, seeder_service_1.SeederService],
        exports: [seeder_service_1.SeederService],
    })
], SeederModule);
//# sourceMappingURL=seeder.module.js.map