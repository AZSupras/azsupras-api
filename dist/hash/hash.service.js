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
var HashService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
let HashService = HashService_1 = class HashService {
    constructor() {
        this.log = new common_1.Logger(HashService_1.name);
    }
    hashSync(input) {
        if (!input)
            throw new Error('Invalid input');
        return bcrypt.hashSync(input, 10);
    }
    compareSync(input, hash) {
        if (!input || !hash)
            throw new Error('Invalid input or hash');
        return bcrypt.compareSync(input, hash);
    }
    async hash(input) {
        if (!input)
            throw new Error('Invalid input');
        return bcrypt.hash(input, 10);
    }
    async compare(input, hash) {
        if (!input || !hash)
            throw new Error('Invalid input or hash');
        return bcrypt.compare(input, hash);
    }
};
exports.HashService = HashService;
exports.HashService = HashService = HashService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HashService);
//# sourceMappingURL=hash.service.js.map