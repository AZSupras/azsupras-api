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
var UserProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProcessor = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./services/user.service");
const schedule_1 = require("@nestjs/schedule");
const async_1 = require("async");
const logger_service_1 = require("../logger/logger.service");
let UserProcessor = UserProcessor_1 = class UserProcessor {
    constructor(userService) {
        this.userService = userService;
        this.logger = new logger_service_1.LoggerService(UserProcessor_1.name);
    }
    async every10Minutes() {
        await this._verifyUsers();
    }
    async _verifyUsers() {
        const users = await this.userService.find({
            where: {
                isVerified: false,
                isBanned: false,
                emailVerified: true,
            },
            select: {
                firstName: true,
                lastName: true,
                username: true,
                emailVerified: true,
            }
        });
        if (users.length === 0) {
            this.logger.debug('No users to verify.');
            return;
        }
        this.logger.debug(`Verifying ${users.length} users`);
        (0, async_1.eachOfSeries)(users, async (user, k) => {
            this.logger.debug(`Verifying user ${user.username} ${k + 1} of ${users.length}`);
            if (user.emailVerified && user.firstName && user.lastName) {
                user.isVerified = true;
                user = await this.userService.update(user.username, user);
                return;
            }
        }, (err) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            else {
                this.logger.debug('all users verified');
            }
        });
    }
};
exports.UserProcessor = UserProcessor;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserProcessor.prototype, "every10Minutes", null);
exports.UserProcessor = UserProcessor = UserProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserProcessor);
//# sourceMappingURL=user.processor.js.map