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
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const hash_service_1 = require("../hash/hash.service");
const logger_service_1 = require("../logger/logger.service");
const user_role_entity_1 = require("../user/entities/user-role.entity");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const async_1 = require("async");
const app_config_service_1 = require("../app-config/app-config.service");
const SeederData_1 = require("./SeederData");
let SeederService = SeederService_1 = class SeederService {
    constructor(userRepo, roleRepository, hashService, configService, appConfigService, logger) {
        this.userRepo = userRepo;
        this.roleRepository = roleRepository;
        this.hashService = hashService;
        this.configService = configService;
        this.appConfigService = appConfigService;
        this.logger = logger;
        this.logger.setContext(SeederService_1.name);
    }
    async upsertAppConfig() {
        const appConfig = await this.appConfigService.getLatest();
        if (!appConfig) {
            this.logger.log('No app config found, creating a new one');
            await this.appConfigService.upsert({
                appName: 'My App',
                registrationEnabled: false,
                emailVerificationRequired: false,
            });
        }
    }
    async run() {
        await this.upsertAppConfig();
        const seedDatabase = this.configService.get('SEED_DATABASE') || 'false';
        if (seedDatabase !== 'true') {
            this.logger.debug('Database seeding is disabled. Set the SEED_DATABASE environment variable to true to enable seeding.');
            return;
        }
        else {
            await this._seedUserRoles(SeederData_1.default.userRoles);
            await this._seedUsers(SeederData_1.default.users);
        }
    }
    async _seedUserRoles(userRoles) {
        if (!userRoles || userRoles.length === 0) {
            this.logger.debug('No user roles to seed.');
            return;
        }
        this.logger.debug(`There are ${userRoles.length} user roles to seed.`);
        const roles = [];
        (0, async_1.eachOfSeries)(userRoles, async (userRole) => {
            const role = await this._seedUserRole(userRole);
            roles.push(role);
            return role;
        }, (err) => {
            if (err) {
                this.logger.error('Error seeding user roles:', err);
                return;
            }
            this.logger.debug('UserRole seeding complete.');
        });
    }
    async _seedUserRole(userRole) {
        this.logger.debug(`Checking if role '${userRole.slug}' exists in the database.`);
        let role = await this.roleRepository.findOne({
            where: {
                slug: userRole.slug,
            },
        });
        if (!role) {
            this.logger.debug(`Role '${userRole.slug}' does not exist in the database. Creating it now.`);
            role = await this.roleRepository.save(userRole);
        }
        this.logger.debug(`Role '${role.slug}' has been created.`);
        return role;
    }
    async _seedUsers(seedUsers) {
        if (!seedUsers || seedUsers.length === 0) {
            this.logger.debug('No users to seed.');
            return;
        }
        this.logger.debug(`There are ${seedUsers.length} Users to seed.`);
        const users = [];
        (0, async_1.eachOfSeries)(seedUsers, async (createUser, i) => {
            this.logger.debug(`Seeding user ${i + 1} of ${seedUsers.length}.`);
            const user = await this._seedUser(createUser);
            users.push(user);
            return user;
        }, (err) => {
            if (err) {
                this.logger.error('Error seeding users:', err);
                return;
            }
            this.logger.debug('User seeding complete.');
        });
    }
    async _seedUser(user) {
        this.logger.debug(`Checking if user '${user.username}' exists in the database.`);
        let dbUser = await this.userRepo.findOne({
            where: {
                username: user.username,
            },
        });
        if (!dbUser) {
            this.logger.debug(`User '${user.username}' does not exist in the database. Creating it now.`);
            const hash = await this.hashService.hash(user.password);
            const roles = await this.roleRepository
                .createQueryBuilder('roles')
                .where('roles.slug IN (:...slugs)', { slugs: user.roleSlugs })
                .getMany();
            dbUser = this.userRepo.create({
                username: user.username,
                password: hash,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                emailVerified: user.emailVerified,
                emailVerifiedAt: user.emailVerifiedAt,
                isPublic: user.isPublic,
                roles: roles,
            });
            dbUser = await this.userRepo.save(dbUser);
            this.logger.log(`User '${dbUser.username}' has been created with password '${user.password}'.`);
        }
        else {
            this.logger.debug(`User '${user.username}' already exists in the database.`);
        }
        return dbUser;
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        hash_service_1.HashService,
        config_1.ConfigService,
        app_config_service_1.AppConfigService,
        logger_service_1.LoggerService])
], SeederService);
//# sourceMappingURL=seeder.service.js.map