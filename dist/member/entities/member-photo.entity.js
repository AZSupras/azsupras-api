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
exports.MemberPhoto = void 0;
const typeorm_1 = require("typeorm");
const member_entity_1 = require("./member.entity");
let MemberPhoto = class MemberPhoto {
};
exports.MemberPhoto = MemberPhoto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MemberPhoto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MemberPhoto.prototype, "memberId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MemberPhoto.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], MemberPhoto.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], MemberPhoto.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => member_entity_1.Member, (member) => member.photo),
    (0, typeorm_1.JoinColumn)({ name: 'memberId' }),
    __metadata("design:type", member_entity_1.Member)
], MemberPhoto.prototype, "member", void 0);
exports.MemberPhoto = MemberPhoto = __decorate([
    (0, typeorm_1.Entity)()
], MemberPhoto);
//# sourceMappingURL=member-photo.entity.js.map