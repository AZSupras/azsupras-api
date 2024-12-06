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
exports.UnbanUserDto = exports.BanUserDto = void 0;
const class_validator_1 = require("class-validator");
class BanUserDto {
}
exports.BanUserDto = BanUserDto;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BanUserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BanUserDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], BanUserDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BanUserDto.prototype, "bannedBy", void 0);
class UnbanUserDto {
}
exports.UnbanUserDto = UnbanUserDto;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UnbanUserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnbanUserDto.prototype, "unbannedBy", void 0);
//# sourceMappingURL=ban-user.dto.js.map