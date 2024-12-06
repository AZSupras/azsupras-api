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
exports.User = void 0;
const invite_entity_1 = require("../../invite/invite.entity");
const subscriber_entity_1 = require("../../subscriber/subscriber.entity");
const user_role_entity_1 = require("./user-role.entity");
const typeorm_1 = require("typeorm");
const bcryptjs_1 = require("bcryptjs");
const ban_entity_1 = require("../../admin/ban/ban/ban.entity");
let User = class User {
    constructor(data = {}) {
        Object.assign(this, data);
    }
    async checkPassword(plainPassword) {
        const results = await (0, bcryptjs_1.compare)(plainPassword, this.password);
        return results;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isBanned", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    __metadata("design:type", Date)
], User.prototype, "bannedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "bannedReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isOnline", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, select: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, select: false }),
    __metadata("design:type", Date)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "passwordResetToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, select: false }),
    __metadata("design:type", Date)
], User.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, select: false }),
    __metadata("design:type", Date)
], User.prototype, "passwordResetRequestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        select: false,
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        select: false,
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => subscriber_entity_1.Subscriber),
    __metadata("design:type", subscriber_entity_1.Subscriber)
], User.prototype, "subscriber", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => invite_entity_1.Invite, (invite) => invite.user),
    __metadata("design:type", invite_entity_1.Invite)
], User.prototype, "invite", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_role_entity_1.UserRole, (role) => role.users),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ban_entity_1.Ban, (ban) => ban.user),
    __metadata("design:type", Array)
], User.prototype, "bans", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], User);
//# sourceMappingURL=user.entity.js.map