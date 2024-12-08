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
exports.IsUserAlreadyExist = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let IsUserAlreadyExist = class IsUserAlreadyExist {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async validate(username) {
        if (!username) {
            return false;
        }
        const user = await this.userRepository.findOne({
            where: {
                username
            }
        });
        return user === null || user === undefined;
    }
    defaultMessage() {
        return 'The email «$value» is already register.';
    }
};
exports.IsUserAlreadyExist = IsUserAlreadyExist;
exports.IsUserAlreadyExist = IsUserAlreadyExist = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isUserAlreadyExist', async: true }),
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IsUserAlreadyExist);
//# sourceMappingURL=is-user-already-exist.validator.js.map