import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '@/hash/hash.service';
import { LoggerService } from '@/logger/logger.service';
import { CreateUserRoleDto } from '@/user/dto/create-user-role.dto';
import { UserRole } from '@/user/entities/user-role.entity';
import { User } from '@/user/entities/user.entity';
import { Repository } from 'typeorm';
import { eachOfSeries } from 'async';
import { AppConfigService } from '@/app-config/app-config.service';
import { AppConfig } from '@/app-config/entities/app-config.entity';
import { SeedData } from './data';
import { SeedUserDto } from './dto/seed-user.dto';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly roleRepository: Repository<UserRole>,
    private readonly hashService: HashService,
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(SeederService.name);
  }

  public async upsertAppConfig() {
    const appConfig: AppConfig = await this.appConfigService.getLatest();

    if (!appConfig) {
      this.logger.log('No app config found, creating a new one');

      await this.appConfigService.upsert({
        appName: 'My App',
        registrationEnabled: false,
        emailVerificationRequired: false,
      });
    }
  }

  public async run() {
    await this.upsertAppConfig();

    const seedDatabase: string =
      this.configService.get<string>('SEED_DATABASE') || 'false';
    if (seedDatabase !== 'true') {
      this.logger.debug(
        'Database seeding is disabled. Set the SEED_DATABASE environment variable to true to enable seeding.',
      );
      return;
    } else {
      // seed userRoles, pass in the user roles to seed, and return the user roles that were created.
      await this._seedUserRoles(SeedData.userRoles)
        .then(async (roles: UserRole[]) => {
          this.logger.debug(`${roles.length} Roles seeded.`);

          let users: User[] = await this._seedUsers(SeedData.users);
          this.logger.debug(`${users.length} Users seeded.`);
        })
        .catch((err) => {
          this.logger.error('Error seeding user roles:', err);
        });
      // then seed users
      // then print a message that seeding is complete with the number of users and roles created.
    }
  }

  private async _seedUserRoles(userRoles: CreateUserRoleDto[]): Promise<UserRole[]> {
    return new Promise(async (resolve, reject) => {
    if (!userRoles || userRoles.length === 0) {
      this.logger.debug('No user roles to seed.');
      return reject('no user roles to seed');
    }

    this.logger.debug(`There are ${userRoles.length} user roles to seed.`);
    const roles: UserRole[] = [];
      // iterate over the user roles and seed them one by one.
      eachOfSeries(
        userRoles,
        async (userRole: CreateUserRoleDto) => {
          const role: UserRole = await this._seedUserRole(userRole);
          roles.push(role);

          return role;
        },
        (err) => {
          if (err) {
            this.logger.error('Error seeding user roles:', err);
            return reject(err);
          }

          this.logger.debug('UserRole seeding complete.');
          return resolve(roles);
        },
      );
    })
  }

  private async _seedUsers(seedUsers: SeedUserDto[]): Promise<User[]> {
    return new Promise(async (resolve, reject) => {
      if (!seedUsers || seedUsers.length === 0) {
        this.logger.debug('No users to seed.');
        return reject('no users to seed');
      }

      this.logger.debug(`There are ${seedUsers.length} Users to seed.`);
      const users: User[] = [];

      // iterate over the user roles and seed them one by one.
      eachOfSeries(
        seedUsers,
        async (createUser: SeedUserDto, i: number) => {
          this.logger.debug(`Seeding user ${i + 1} of ${seedUsers.length}.`);

          const user: User = await this._seedUser(createUser);

          users.push(user);

          return user;
        },
        (err) => {
          if (err) {
            this.logger.error('Error seeding users:', err);
            return reject(err);
          }

          this.logger.debug('User seeding complete.');
          return resolve(users);
        },
      );
    });
  }

  private async _seedUserRole(userRole: CreateUserRoleDto) {
    // see if the role exists in the database.
    this.logger.debug(
      `Checking if role '${userRole.slug}' exists in the database.`,
    );
    let role: UserRole | null = await this.roleRepository.findOne({
      where: {
        slug: userRole.slug,
      },
    });

    if (!role) {
      this.logger.debug(
        `Role '${userRole.slug}' does not exist in the database. Creating it now.`,
      );
      role = await this.roleRepository.save(userRole);
    }

    this.logger.debug(`Role '${role.slug}' has been created.`);

    return role;
  }

  private async _seedUser(user: SeedUserDto) {
    this.logger.debug(
      `Checking if user '${user.username}' exists in the database.`,
    );
    // see if the user exists in the database.
    let dbUser: User | null = await this.userRepo.findOne({
      where: {
        username: user.username,
      },
    });

    // if the user does not exist, create it.
    if (!dbUser) {
      this.logger.debug(
        `User '${user.username}' does not exist in the database. Creating it now.`,
      );
      const hash = await this.hashService.hash(user.password);
      const roles = await this.roleRepository
        .createQueryBuilder('roles')
        .where('roles.slug IN (:...slugs)', { slugs: user.roleSlugs })
        .getMany();

      console.log(roles);

      const newUser: Partial<User> = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: hash,
        email: user.email,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        roles: roles,
        privacySettings: {
          firstNameVisible: user.privacySettings.firstNameVisible || true,
          lastNameVisible: user.privacySettings.lastNameVisible || false,
          middleNameVisible: user.privacySettings.middleNameVisible || false,
          suffixVisible: user.privacySettings.suffixVisible || false,
          emailVisible: user.privacySettings.emailVisible || false,
          isPublic: user.privacySettings.isPublic || true,
        },
      };

      dbUser = this.userRepo.create(newUser);

      dbUser = await this.userRepo.save(dbUser);
      this.logger.log(
        `User '${dbUser.username}' has been created with password '${user.password}'.`,
      );
    } else {
      this.logger.debug(
        `User '${user.username}' already exists in the database.`,
      );
    }

    return dbUser;
  }
}
