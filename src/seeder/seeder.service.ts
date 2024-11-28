import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { LoggerService } from 'src/logger/logger.service';
import { CreateUserRoleDto } from 'src/user-role/dto/create-user-role.dto';
import { UserRole } from 'src/user-role/user-role.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { eachOfSeries } from 'async';

export type SeedUserDto = CreateUserDto & {
    roleSlugs: string[],
    emailVerifiedAt?: Date|null,
    emailVerified: boolean,
}

export type SeedData = {
    userRoles: CreateUserRoleDto[],
    users: SeedUserDto[],
}

const seedData = {
    userRoles: [
        {
            slug: 'admin',
            name: 'Admin',
        },
        {
            slug: 'user',
            name: 'User',
        },
    ],
    users: [
        {
            username: 'admin',
            password: 'password',
            email: 'gordonfreeman@test.com',
            emailVerified: true,
            emailVerifiedAt: new Date(),
            firstName: 'Gordon',
            lastName: 'Freeman',
            isPublic: false,
            roleSlugs: ['admin', 'user'],
        },
    ]
}

@Injectable()
export class SeederService {
    private readonly logger = new LoggerService(SeederService.name);
    
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private readonly roleRepository: Repository<UserRole>,
        private readonly hashService: HashService,
        private readonly configService: ConfigService,
    ) {}

    public async run() {
        const seedDatabase: boolean = this.configService.get<boolean>('SEED_DATABASE') || false;

        if (!seedDatabase) {
            this.logger.debug('Database seeding is disabled. Set the SEED_DATABASE environment variable to true to enable seeding.');
            return;
        }

        // seed userRoles, pass in the user roles to seed, and return the user roles that were created.
        await this._seedUserRoles(seedData.userRoles);
        // then seed users
        await this._seedUsers(seedData.users);
        // then print a message that seeding is complete with the number of users and roles created.
    }

    private async _seedUserRoles(userRoles: CreateUserRoleDto[]) {
        if (!userRoles || userRoles.length === 0) {
            this.logger.debug('No user roles to seed.');
            return;
        }

        this.logger.debug(`There are ${userRoles.length} user roles to seed.`);
        const roles: UserRole[] = [];

        // iterate over the user roles and seed them one by one.
        eachOfSeries(userRoles, async (userRole: CreateUserRoleDto, i: number) => {
            const role: UserRole  = await this._seedUserRole(userRole);
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

    private async _seedUserRole(userRole: CreateUserRoleDto) {
        // see if the role exists in the database.
        this.logger.debug(`Checking if role '${userRole.slug}' exists in the database.`);
        let role: UserRole|null = await this.roleRepository.findOne({
            where: {
                slug: userRole.slug,
            }
        });

        if (!role) {
            this.logger.debug(`Role '${userRole.slug}' does not exist in the database. Creating it now.`);
            role = await this.roleRepository.save(userRole);
        }

        this.logger.debug(`Role '${role.slug}' has been created.`);

        return role;
    }

    private async _seedUsers(seedUsers: SeedUserDto[]) {
        if (!seedUsers || seedUsers.length === 0) {
            this.logger.debug('No users to seed.');
            return;
        }

        this.logger.debug(`There are ${seedUsers.length} Users to seed.`);
        const users: User[] = [];

        // iterate over the user roles and seed them one by one.
        eachOfSeries(seedUsers, async (createUser: SeedUserDto, i: number) => {
            this.logger.debug(`Seeding user ${i + 1} of ${seedUsers.length}.`);

            const user: User  = await this._seedUser(createUser);

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

    private async _seedUser(user: SeedUserDto) {
        this.logger.debug(`Checking if user '${user.username}' exists in the database.`);
        // see if the user exists in the database.
        let dbUser: User|null = await this.userRepository.findOne({
            where: {
                username: user.username,
            }
        });

        // if the user does not exist, create it.
        if (!dbUser) {
            this.logger.debug(`User '${user.username}' does not exist in the database. Creating it now.`);
            const hash = await this.hashService.hash(user.password);
            const roles = await this.roleRepository.createQueryBuilder('roles')
            .where('roles.slug IN (:...slugs)', { slugs: user.roleSlugs })
            .getMany();

            dbUser = this.userRepository.create({
                username: user.username,
                password: hash,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                emailVerifiedAt: user.emailVerifiedAt,
                roles: roles
            });

            dbUser = await this.userRepository.save(dbUser);
            this.logger.log(`User '${dbUser.username}' has been created with password '${user.password}'.`);

        } else {
            this.logger.debug(`User '${user.username}' already exists in the database.`);
        }


        return dbUser;
    }
}
