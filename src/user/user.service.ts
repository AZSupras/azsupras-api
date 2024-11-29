import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import { HashService } from 'src/hash/hash.service';
import { PublicUserDto } from './dto/public-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from 'src/logger/logger.service';
import { UserRole } from 'src/user-role/user-role.entity';

@Injectable()
export class UserService {
  private readonly logger = new LoggerService(UserService.name);

  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    @InjectRepository(UserRole)
    private roleRepo: Repository<UserRole>,
    private hashService: HashService,
  ) { }

  public async findAll(): Promise<User[]> {
    const queryOptions: FindManyOptions<User> = {
      relations: ['roles', 'profile'],
    };
    const results = await this.repo.find(queryOptions);

    return results;
  }

  public async Public_findAll(): Promise<PublicUserDto[]> {
    const queryOptions: FindManyOptions<User> = {
      select: {
        username: true,
        roles: {
          slug: true,
          name: true,
        },
      },
      where: { isPublic: true },
    };

    const results: PublicUserDto[] = await this.repo.find(queryOptions);

    return results;
  }

  public async Public_findOneByUsername(
    username: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const queryOptions: FindOneOptions<User> = {
      where: {
        username,
        isPublic: true,
      },
      ...options,
    };

    const results = await this.repo.findOne(queryOptions);

    return results;
  }

  public async findOneById(
    id: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const queryOptions: FindOneOptions<User> = {
      where: { id },
      ...options,
    };

    const results = await this.repo.findOne(queryOptions);

    return results;
  }

  public async findOneByEmail(
    email: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const queryOptions: FindOneOptions<User> = {
      where: {
        email,
      },
      ...options,
    };

    const results = await this.repo.findOne(queryOptions);

    return results;
  }

  public async findOneByUsername(
    username: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const queryOptions: FindOneOptions<User> = {
      where: {
        username,
      },
      select: {
        username: true,
      },
      ...options,
    };

    const results = await this.repo.findOne(queryOptions);

    return results;
  }

  // create a new user
  public async create(newUserDto: CreateUserDto): Promise<User> {
    const roles = await this.roleRepo
    .createQueryBuilder('roles')
    .where('roles.slug IN (:...slugs)', { slugs: newUserDto.roleSlugs })
    .getMany();

    const newUser: Partial<User> = {
      username: newUserDto.username,
      email: newUserDto.email,
      password: this.hashService.hashSync(newUserDto.password),
      roles: roles,
    };

    let user: User = await this.repo.create(newUser);
    user = await this.repo.save(user);

    user = await this.findOneById(user.id);

    return user;
  }

  public async clearAll(): Promise<void> {
    await this.repo.clear();
  }
}
