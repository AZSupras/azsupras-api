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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const hash_service_1 = require("../../hash/hash.service");
const logger_service_1 = require("../../logger/logger.service");
const user_role_service_1 = require("./user-role.service");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const adjectives = [
    "Adventurous", "Brave", "Calm", "Delightful", "Eager", "Faithful", "Gentle",
    "Happy", "Inventive", "Jolly", "Kind", "Lively", "Merry", "Nice", "Obedient",
    "Proud", "Quiet", "Relieved", "Silly", "Thankful", "Victorious", "Witty",
    "Zealous", "Angry", "Bewildered", "Clumsy", "Defeated", "Embarrassed",
    "Fierce", "Grumpy", "Helpless", "Itchy", "Jealous", "Lazy", "Mysterious",
    "Nervous", "Obnoxious", "Panicky", "Repulsive", "Scary", "Thoughtless",
    "Uptight", "Worried", "Agreeable", "Amiable", "Arrogant", "Audacious",
    "Benevolent", "Brilliant", "Candid", "Charming", "Cheerful", "Compassionate",
    "Confident", "Courageous", "Creative", "Curious", "Daring", "Determined",
    "Diligent", "Eccentric", "Elegant", "Eloquent", "Enthusiastic", "Exuberant",
    "Fancy", "Fearless", "Festive", "Friendly", "Funny", "Generous", "Gifted",
    "Glamorous", "Gleeful", "Glorious", "Graceful", "Gregarious", "Honest",
    "Humble", "Humorous", "Imaginative", "Independent", "Innocent", "Intelligent",
    "Joyful", "Jubilant", "Keen", "Loyal", "Magnificent", "Majestic",
    "Mischievous", "Modest", "Optimistic", "Passionate", "Peaceful", "Playful",
    "Polite", "Powerful", "Precious", "Protective", "Radiant", "Reckless",
    "Reliable", "Resourceful", "Romantic", "Rough", "Rude", "Sarcastic",
    "Sassy", "Sensible", "Serious", "Sharp", "Shy", "Silly", "Sincere",
    "Sleepy", "Slow", "Smooth", "Sneaky", "Sparkling", "Splendid", "Strange",
    "Strong", "Stunning", "Sweet", "Talented", "Tame", "Tender", "Thoughtful",
    "Timid", "Tough", "Tricky", "Troubled", "Trustworthy", "Unique", "Vivacious",
    "Vulnerable", "Warm", "Wild", "Wise", "Zany"
];
const nouns = [
    "Tiger", "Eagle", "Shark", "Lion", "Panther", "Wolf", "Bear", "Fox", "Hawk",
    "Falcon", "Leopard", "Jaguar", "Cheetah", "Cougar", "Lynx", "Bobcat",
    "Ocelot", "Puma", "Hyena", "Jackal", "Coyote", "Dingo", "Otter", "Beaver",
    "Raccoon", "Skunk", "Badger", "Weasel", "Mink", "Ferret", "Squirrel",
    "Chipmunk", "Hedgehog", "Porcupine", "Armadillo", "Sloth", "Anteater",
    "Aardvark", "Platypus", "Kangaroo", "Wallaby", "Koala", "Possum", "Wombat",
    "Tasmanian Devil", "Mongoose", "Meerkat", "Lemur", "Monkey", "Gorilla",
    "Chimpanzee", "Orangutan", "Baboon", "Gibbon", "Macaque", "Mandrill",
    "Tamarin", "Capuchin", "Saki", "Howler Monkey", "Spider Monkey",
    "Squirrel Monkey", "Marmoset", "Tarsier", "Aye-aye", "Loris", "Galago",
    "Bushbaby", "Pangolin", "Elephant", "Rhinoceros", "Hippopotamus", "Giraffe",
    "Zebra", "Horse", "Donkey", "Mule", "Camel", "Llama", "Alpaca", "Vicuna",
    "Guanaco", "Buffalo", "Bison", "Yak", "Cow", "Bull", "Ox", "Goat",
    "Albatross", "Antelope", "Bat", "Bluebird", "Butterfly", "Caterpillar",
    "Cobra", "Crane", "Crocodile", "Crow", "Deer", "Dog", "Dolphin", "Dove",
    "Dragonfly", "Duck", "Eel", "Flamingo", "Fly", "Frog", "Gazelle", "Gecko",
    "Goose", "Gopher", "Grasshopper", "Hare", "Heron", "Hornet", "Horsefly",
    "Hummingbird", "Iguana", "Jellyfish", "Ladybug", "Lobster", "Manatee",
    "Mole", "Moose", "Mosquito", "Moth", "Mouse", "Nightingale", "Octopus",
    "Ostrich", "Owl", "Oyster", "Parrot", "Peacock", "Penguin", "Pig", "Pigeon",
    "Pony", "Porpoise", "Python", "Rabbit", "Rat", "Raven", "Reindeer",
    "Salamander", "Salmon", "Scorpion", "Seagull", "Seahorse", "Seal", "Sheep",
    "Shrew", "Skink", "Snake", "Sparrow", "Spider", "Squid", "Starfish", "Stork",
    "Swan", "Termite", "Toad", "Tortoise", "Turkey", "Turtle", "Vulture", "Walrus",
    "Wasp", "Whale", "Wildcat", "Wolf", "Wolverine", "Woodpecker", "Worm"
];
let UserService = UserService_1 = class UserService {
    constructor(repo, userRoleService, hashService) {
        this.repo = repo;
        this.userRoleService = userRoleService;
        this.hashService = hashService;
        this.logger = new logger_service_1.LoggerService(UserService_1.name);
    }
    _generateRandomAlphanumeric(length) {
        return (0, crypto_1.randomBytes)(length / 2).toString('hex');
    }
    async _isCodeUnique(emailVerificationToken) {
        const count = await this.repo.count({ where: { emailVerificationToken } });
        return count === 0;
    }
    async _generateUniqueCode(length = 16) {
        let code;
        do {
            code = this._generateRandomAlphanumeric(length);
        } while (!(await this._isCodeUnique(code)));
        return code;
    }
    generateRandomUsername() {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const randomNumber = Math.floor(Math.random() * 1000);
        return `${randomAdjective}${randomNoun}${randomNumber}`;
    }
    async find(query) {
        const results = await this.repo.find(query);
        return results;
    }
    async findOne(query) {
        const results = await this.repo.findOne(query);
        return results;
    }
    async findAll() {
        const query = {
            relations: ['roles'],
        };
        const results = await this.repo.find(query);
        return results;
    }
    async Public_findAll() {
        const query = {
            select: {
                username: true,
                roles: {
                    slug: true,
                    name: true,
                },
            },
            where: { isPublic: true },
        };
        const results = await this.repo.find(query);
        return results;
    }
    async Public_findOneByUsername(username, options) {
        const query = {
            where: {
                username,
                isPublic: true,
            },
            ...options,
        };
        const results = await this.repo.findOne(query);
        return results;
    }
    async findOneById(id, options) {
        const query = {
            where: { id },
            ...options,
        };
        const results = await this.repo.findOne(query);
        return results;
    }
    async findOneByEmail(email, options) {
        const query = {
            where: {
                email,
            },
            ...options,
        };
        const results = await this.repo.findOne(query);
        return results;
    }
    async findOneByUsername(username, options) {
        const query = {
            where: {
                username,
            },
            ...options,
        };
        const results = await this.repo.findOne(query);
        return results;
    }
    async forgotPassword(email) {
        let user = await this.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException(`User not found.`);
        }
        user.passwordResetToken = await this._generateUniqueCode(16);
        user.passwordResetRequestedAt = new Date();
        user.passwordResetExpires = new Date(Date.now() + 3600000);
        user = await this.repo.save(user);
        user = await this.findOneById(user.id, {
            select: {
                username: true,
                email: true,
                passwordResetToken: true,
                firstName: true,
                lastName: true,
                roles: {
                    slug: true,
                },
            }
        });
        return user;
    }
    async findEmailVerificationTokenUsername(username) {
        const query = {
            where: {
                username,
            },
            select: {
                id: true,
                username: true,
                emailVerificationToken: true,
                firstName: true,
                lastName: true,
                email: true,
            }
        };
        const results = await this.repo.findOne(query);
        return results;
    }
    async findUserByEmailVerificationToken(emailVerificationToken) {
        const query = {
            where: {
                emailVerificationToken,
            },
            select: {
                id: true,
                username: true,
                emailVerificationToken: true,
                firstName: true,
                lastName: true,
                email: true,
            }
        };
        const results = await this.repo.findOne(query);
        return results;
    }
    async confirmEmail(token) {
        let user = await this.findUserByEmailVerificationToken(token);
        if (!user) {
            throw new common_1.NotFoundException(`User not found.`);
        }
        user.emailVerificationToken = null;
        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
        user = await this.update(user.id, user);
        return user;
    }
    async findOneByIdentity(identity, options) {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity);
        const query = {
            where: {
                [isEmail ? 'email' : 'username']: identity,
            },
            relations: ['roles'],
            ...options
        };
        const user = await this.repo.findOne(query);
        return user;
    }
    async findOneByIdentity_withPassword(identity, options) {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity);
        const query = {
            where: {
                [isEmail ? 'email' : 'username']: identity,
            },
            select: {
                id: true,
                username: true,
                password: true,
                isBanned: true,
                roles: {
                    slug: true,
                },
            },
            relations: ['roles'],
            ...options
        };
        const user = await this.repo.findOne(query);
        return user;
    }
    async checkUsernameAvailability(username) {
        const count = await this.repo.count({
            where: {
                username
            },
        });
        return (count === 0);
    }
    async save(user) {
        user = await this.repo.save(user);
        return user;
    }
    async create(newUserDto, options) {
        const roles = await this.userRoleService.findManyBySlugs(newUserDto.roleSlugs);
        if (!roles) {
            throw new common_1.InternalServerErrorException(`There are no user roles found for the provided role slugs '${newUserDto.roleSlugs}'.`);
        }
        const newUser = {
            username: newUserDto.username || this.generateRandomUsername(),
            email: newUserDto.email,
            firstName: newUserDto.firstName,
            lastName: newUserDto.lastName,
            password: this.hashService.hashSync(newUserDto.password),
            roles: roles,
        };
        if (newUserDto.email) {
            newUser.emailVerificationToken = await this._generateUniqueCode(16);
        }
        let user = this.repo.create(newUser);
        user = await this.save(user);
        user = await this.findOneById(user.id, {
            select: {
                username: true,
                email: true,
                emailVerificationToken: true,
                firstName: true,
                lastName: true,
                roles: {
                    slug: true,
                },
            }
        });
        return user;
    }
    async update(username, updateUserDto, options) {
        const user = await this.findOneByUsername(username);
        if (!user) {
            throw new common_1.NotFoundException(`User with username '${username}' not found.`);
        }
        let updatedUser = await this.repo.save({
            ...user,
            ...updateUserDto,
        });
        updatedUser = await this.findOneById(updatedUser.id, options);
        return updatedUser;
    }
    async updateLastLogin(id) {
        let user = await this.findOneById(id, {
            relations: ['roles'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id '${id}' not found.`);
        }
        user.lastLogin = new Date();
        user = await this.save(user);
        return user;
    }
    async toggleOnlineStatus(id, override) {
        let user = await this.findOneById(id, {
            relations: ['roles'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id '${id}' not found.`);
        }
        user.isOnline = override || !user.isOnline;
        user = await this.save(user);
        return user;
    }
    async getOnlineAdminCount() {
        const query = {
            where: {
                isOnline: true,
                roles: [
                    {
                        slug: 'admin'
                    }
                ]
            },
        };
        const results = await this.repo.count(query);
        return results;
    }
    async getOfflineAdminCount() {
        const query = {
            where: {
                isOnline: false,
                roles: [
                    {
                        slug: 'admin'
                    }
                ]
            },
        };
        const results = await this.repo.count(query);
        return results;
    }
    async getOnlineUserCount() {
        const query = {
            where: {
                isOnline: true,
                roles: [
                    {
                        slug: 'user'
                    }
                ]
            },
        };
        const results = await this.repo.count(query);
        return results;
    }
    async getOfflineUserCount() {
        const query = {
            where: {
                isOnline: false,
                roles: [
                    {
                        slug: 'user'
                    }
                ]
            },
        };
        const results = await this.repo.count(query);
        return results;
    }
    async resetPassword(token, password) {
        let user = await this.findOne({
            where: {
                passwordResetToken: token,
            }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User not found.`);
        }
        user.password = this.hashService.hashSync(password);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        user.passwordResetRequestedAt = null;
        user = await this.repo.save(user);
        return user;
    }
    async clearAll() {
        await this.repo.clear();
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_role_service_1.UserRoleService,
        hash_service_1.HashService])
], UserService);
//# sourceMappingURL=user.service.js.map