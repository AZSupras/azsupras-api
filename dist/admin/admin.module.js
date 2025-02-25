"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const user_module_1 = require("../user/user.module");
const admin_controller_1 = require("./admin.controller");
const user_admin_controller_1 = require("./user/user.admin.controller");
const user_admin_service_1 = require("./user/user.admin.service");
const user_role_admin_controller_1 = require("./user/user-role.admin.controller");
const user_role_admin_service_1 = require("./user/user-role.admin.service");
const member_admin_module_1 = require("./member/member.admin.module");
const user_ban_module_1 = require("./user/user-ban.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            user_ban_module_1.UserBanModule,
            member_admin_module_1.AdminMemberModule,
        ],
        providers: [admin_service_1.AdminService, user_admin_service_1.AdminUserService, user_role_admin_service_1.AdminUserRoleService],
        controllers: [
            admin_controller_1.AdminController,
            user_admin_controller_1.AdminUserController,
            user_role_admin_controller_1.UserRoleAdminController,
        ],
        exports: [admin_service_1.AdminService, user_admin_service_1.AdminUserService, user_role_admin_service_1.AdminUserRoleService,],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map