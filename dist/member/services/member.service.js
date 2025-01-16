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
var MemberService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../../logger/logger.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const member_entity_1 = require("../entities/member.entity");
const member_photo_entity_1 = require("../entities/member-photo.entity");
const member_vehicle_entity_1 = require("../entities/member-vehicle.entity");
let MemberService = MemberService_1 = class MemberService {
    constructor(repo, photoRepo, vehicleRepo) {
        this.repo = repo;
        this.photoRepo = photoRepo;
        this.vehicleRepo = vehicleRepo;
        this.logger = new logger_service_1.LoggerService(MemberService_1.name);
    }
    async find(query) {
        const results = await this.repo.find(query);
        return results;
    }
    async findAll() {
        const query = {
            relations: ['photo'],
        };
        const results = await this.repo.find(query);
        return results;
    }
    async findOne(query) {
        const results = await this.repo.findOne(query);
        return results;
    }
    async findOneById(id) {
        const results = await this.repo.findOne({ where: { id }, relations: ['photo'], });
        return results;
    }
    async create(data) {
        const member = this.repo.create(data);
        const results = await this.repo.save(member);
        return results;
    }
    async update(id, data) {
        const member = await this.repo.findOne({ where: { id } });
        const results = await this.repo.save({ ...member, ...data });
        return results;
    }
    async remove(id) {
        const member = await this.repo.findOne({ where: { id } });
        const results = await this.repo.remove(member);
        return results;
    }
    async createPhoto(data) {
        let photo = this.photoRepo.create(data);
        let member = await this.repo.findOne({ where: { id: data.memberId }, relations: ['photo'] });
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        photo.member = member;
        photo = await this.photoRepo.save(photo, {
            reload: true,
        });
        return photo;
    }
    async getMemberPhoto(memberId) {
        const photo = await this.photoRepo.findOne({ where: { member: { id: memberId } } });
        return photo;
    }
    async uploadPhoto(memberId, file) {
        const photo = new member_photo_entity_1.MemberPhoto();
        photo.url = process.env.NODE_ENV === 'production' ? file.location : `/uploads/members/${memberId}/${file.filename}`;
        photo.memberId = memberId;
        return await this.photoRepo.save(photo);
    }
    async removePhoto(id) {
        const photo = await this.photoRepo.findOne({ where: { id } });
        const results = await this.photoRepo.remove(photo);
        return results;
    }
    async removeMemberPhoto(memberId) {
        const photo = await this.photoRepo.findOne({ where: { member: { id: memberId } } });
        if (!photo) {
            throw new common_1.NotFoundException('Photo not found');
        }
        const results = await this.photoRepo.remove(photo);
        return results;
    }
    async findAllMemberPhoto(memberId) {
        const results = await this.photoRepo.find({ where: { memberId } });
        return results;
    }
    async findOneMemberPhotoById(id) {
        const results = await this.photoRepo.findOne({ where: { id } });
        return results;
    }
    async getMemberVehicles(memberId) {
        const results = await this.vehicleRepo.find({ where: { member: { id: memberId } }, });
        return results;
    }
    async getAllVehicles() {
        const results = await this.vehicleRepo.find();
        return results;
    }
    async getVehicleById(id) {
        const results = await this.vehicleRepo.findOne({ where: { id }, });
        return results;
    }
    async createVehicle(data) {
        const vehicle = this.vehicleRepo.create(data);
        const results = await this.vehicleRepo.save(vehicle);
        return results;
    }
    async updateVehicle(id, data) {
        const vehicle = await this.vehicleRepo.findOne({ where: { id } });
        const results = await this.vehicleRepo.save({ ...vehicle, ...data });
        return results;
    }
    async removeVehicle(id) {
        const vehicle = await this.vehicleRepo.findOne({ where: { id } });
        const results = await this.vehicleRepo.remove(vehicle);
        return results;
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = MemberService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(member_entity_1.Member)),
    __param(1, (0, typeorm_1.InjectRepository)(member_photo_entity_1.MemberPhoto)),
    __param(2, (0, typeorm_1.InjectRepository)(member_vehicle_entity_1.MemberVehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MemberService);
//# sourceMappingURL=member.service.js.map