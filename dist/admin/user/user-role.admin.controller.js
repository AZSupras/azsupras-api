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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleAdminController = void 0;
const common_1 = require("@nestjs/common");
const is_authenticated_guard_1 = require("../../auth/guards/is-authenticated.guard");
const is_admin_guard_1 = require("../../auth/guards/is-admin.guard");
const user_role_admin_service_1 = require("./user-role.admin.service");
const swagger_1 = require("@nestjs/swagger");
let UserRoleAdminController = class UserRoleAdminController {
    constructor(userRoleService) {
        this.userRoleService = userRoleService;
    }
    async Admin_getAllUserRoles() {
        const results = await this.userRoleService.findAll();
        const response = {
            statusCode: 200,
            message: 'Successfully fetched all user roles',
            count: results.length,
            data: results,
        };
        return response;
    }
};
exports.UserRoleAdminController = UserRoleAdminController;
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserRoleAdminController.prototype, "Admin_getAllUserRoles", null);
exports.UserRoleAdminController = UserRoleAdminController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(['admin/role', 'admin/roles']),
    __metadata("design:paramtypes", [user_role_admin_service_1.AdminUserRoleService])
], UserRoleAdminController);
//# sourceMappingURL=user-role.admin.controller.js.map