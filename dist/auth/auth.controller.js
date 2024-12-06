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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../user/decorators/user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const auth_service_1 = require("./auth.service");
const sign_up_dto_1 = require("./dto/sign-up.dto");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const is_authenticated_guard_1 = require("./guards/is-authenticated.guard");
const is_guest_guard_1 = require("./guards/is-guest.guard");
const jwt_payload_interface_1 = require("./interfaces/jwt-payload.interface");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(signUp) {
        const data = await this.authService.register(signUp);
        const response = {
            statusCode: 201,
            message: 'Registration successful',
            data,
        };
        return response;
    }
    async login(user) {
        const response = {
            statusCode: 200,
            message: 'Login successful',
            data: user,
        };
        return response;
    }
    async logout(request) {
        await this.authService.logout(request);
        const response = {
            statusCode: 200,
            message: 'Logout successful'
        };
        return response;
    }
    me(user) {
        const response = {
            statusCode: 200,
            message: 'Your profile.',
            data: user,
        };
        return response;
    }
    async confirmEmail(request, token) {
        if (!token) {
            const response = {
                statusCode: 400,
                message: 'Token is required',
            };
            return response;
        }
        let user = await this.authService.findUserByEmailVerificationToken(token);
        if (!user) {
            const response = {
                statusCode: 400,
                message: 'No user found for provided token, could token be expired or already claimed?',
            };
            return response;
        }
        if (user.emailVerified) {
            const response = {
                statusCode: 400,
                message: 'Email already confirmed',
            };
            return response;
        }
        if (user.emailVerificationToken !== token) {
            const response = {
                statusCode: 400,
                message: 'Invalid token',
            };
            return response;
        }
        user = await this.authService.confirmEmail(token);
        if (!user) {
            const response = {
                statusCode: 400,
                message: 'Invalid token',
            };
            return response;
        }
        const response = {
            statusCode: 200,
            message: 'Email confirmed, You can close this window.',
            data: user,
        };
        return response;
    }
    async forgotPassword({ email }) {
        return this.authService.forgotPassword(email)
            .then(() => {
            const r = {
                statusCode: 200,
                message: 'Password reset link will be sent to your email.',
            };
            return r;
        })
            .catch((error) => {
            throw new common_1.InternalServerErrorException(error);
        });
    }
    async resetPassword(payload) {
        return this.authService.resetPassword(payload)
            .then((data) => {
            const r = {
                statusCode: 200,
                message: 'Password reset successful.',
                data,
            };
            return r;
        })
            .catch((error) => {
            throw new common_1.InternalServerErrorException(error);
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseGuards)(is_guest_guard_1.IsGuestGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(is_guest_guard_1.IsGuestGuard, local_auth_guard_1.LocalAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('/me'),
    (0, common_1.UseGuards)(is_authenticated_guard_1.IsAuthenticatedGuard),
    __param(0, (0, user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('confirm-email'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.UseGuards)(is_guest_guard_1.IsGuestGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwt_payload_interface_1.IForgotPasswordValues]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.UseGuards)(is_guest_guard_1.IsGuestGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwt_payload_interface_1.IResetPasswordValues]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map