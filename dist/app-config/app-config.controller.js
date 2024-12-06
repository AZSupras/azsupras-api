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
var AppConfigController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigController = void 0;
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("./app-config.service");
const create_app_config_dto_1 = require("./dto/create-app-config.dto");
const is_authenticated_guard_1 = require("../auth/guards/is-authenticated.guard");
const is_admin_guard_1 = require("../auth/guards/is-admin.guard");
let AppConfigController = AppConfigController_1 = class AppConfigController {
    constructor(appConfigService) {
        this.appConfigService = appConfigService;
        this.logger = new common_1.Logger(AppConfigController_1.name);
    }
    async getLatestConfig() {
        const data = await this.appConfigService.getLatest();
        if (!data) {
            this.logger.warn('No app config found');
            throw new common_1.InternalServerErrorException('No app config found');
        }
        const response = {
            statusCode: 200,
            message: 'Success',
            data,
        };
        return response;
    }
    async getAllConfigs() {
        const data = await this.appConfigService.findAll();
        if (!data) {
            this.logger.warn('No app config found');
            throw new common_1.InternalServerErrorException('No app config found');
        }
        const response = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };
        return response;
    }
    async upsert(createAppConfigDto) {
        if (!createAppConfigDto) {
            throw new common_1.InternalServerErrorException('No data provided');
        }
        const data = await this.appConfigService.upsert(createAppConfigDto);
        const response = {
            statusCode: 200,
            message: 'Record upserted',
            data,
        };
        return response;
    }
    async delete(id) {
        const data = await this.appConfigService.delete(id);
        const response = {
            statusCode: 200,
            message: data.affected && data.affected > 0
                ? 'Record deleted'
                : 'Record not found',
            data,
        };
        return response;
    }
};
exports.AppConfigController = AppConfigController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "getLatestConfig", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "getAllConfigs", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_app_config_dto_1.CreateAppConfigDto]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "upsert", null);
__decorate([
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard, is_admin_guard_1.IsAdminGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "delete", null);
exports.AppConfigController = AppConfigController = AppConfigController_1 = __decorate([
    (0, common_1.Controller)('config'),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService])
], AppConfigController);
//# sourceMappingURL=app-config.controller.js.map