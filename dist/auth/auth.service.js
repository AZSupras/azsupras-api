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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/services/user.service");
const user_profile_dto_1 = require("../user/dto/user-profile.dto");
const bull_1 = require("@nestjs/bull");
let AuthService = class AuthService {
    constructor(userService, jwtService, emailQueue) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailQueue = emailQueue;
    }
    async register(signUp) {
        const existingUser = await this.userService.findOneByIdentity(signUp.username);
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const createUserDto = {
            username: signUp.username,
            email: signUp.email,
            password: signUp.password,
            firstName: signUp.firstName,
            lastName: signUp.lastName,
            roleSlugs: ['user'],
        };
        const user = await this.userService.create(createUserDto);
        delete user.password;
        if (user.email) {
            const welcomeEmail = {
                to: user.email,
                template: 'welcome',
                context: {
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            };
            const confirmEmail = {
                to: user.email,
                template: 'confirm_email',
                context: {
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            };
            const welcomeEmailJob = this.emailQueue.add(welcomeEmail);
            const confirmEmailJob = this.emailQueue.add(confirmEmail);
            await Promise.all([welcomeEmailJob, confirmEmailJob]);
            console.log('Emails sent');
        }
        return user;
    }
    async login(identity, password) {
        let user;
        let profile;
        try {
            user = await this.userService.findOneByIdentity_withPassword(identity);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (user.isBanned) {
                throw new common_1.UnauthorizedException('Unable to perform login, this account has been banned.');
            }
            const isPasswordValid = await user.checkPassword(password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            await this.userService.updateLastLogin(user.id);
            user = await this.userService.toggleOnlineStatus(user.id, true);
            delete user.password;
        }
        catch (err) {
            throw err;
        }
        profile = new user_profile_dto_1.IUser(user);
        return profile;
    }
    async logout(request) {
        return new Promise(async (resolve, reject) => {
            let user = request.user;
            user = await this.userService.toggleOnlineStatus(user.id, false);
            request.session.destroy(() => {
                resolve();
            });
        });
    }
    async forgotPassword(email) {
        return this.userService.forgotPassword(email)
            .then((user) => {
            const passwordResetEmail = {
                to: user.email,
                template: 'password_reset',
                context: {
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: user.passwordResetToken,
                },
            };
            const passwordResetEmailJob = this.emailQueue.add(passwordResetEmail);
            return;
        });
    }
    async verifyPayload(payload) {
        let user;
        try {
            user = await this.userService.findOneByIdentity(payload.sub);
        }
        catch (error) {
            throw new common_1.UnauthorizedException(`There isn't any user with email: ${payload.sub}`);
        }
        return user;
    }
    async findUserByEmailVerificationToken(token) {
        return await this.userService.findUserByEmailVerificationToken(token);
    }
    async findUserByUserId(userId) {
        try {
            let user = await this.userService.findOneById(userId);
            return user;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async confirmEmail(token) {
        try {
            let user = await this.userService.confirmEmail(token);
            return user;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    signToken(user) {
        const payload = {
            sub: user.username,
        };
        return this.jwtService.sign(payload);
    }
    async resetPassword({ token, password }) {
        const user = await this.userService.resetPassword(token, password);
        return user;
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "logout", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bull_1.InjectQueue)('email')),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map