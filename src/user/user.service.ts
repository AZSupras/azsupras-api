import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import { HashService } from 'src/hash/hash.service';
import { PublicUserDto } from './dto/public-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class UserService {
  private readonly logger = new LoggerService(UserService.name);

  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private hashService: HashService,
  ) {}

  public async findAll(): Promise<User[]> {
    const queryOptions: FindManyOptions<User> = {
      relations: ['roles'],
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
  public async create(newUser: CreateUserDto): Promise<User> {
    let user: User = new User();

    user.username = newUser.username;
    user.email = newUser.email;
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;
    user.password = this.hashService.hashSync(newUser.password);
    user = this.repo.create(user);

    await this.repo.save(user);

    return user;
  }

  public async clearAll(): Promise<void> {
    await this.repo.clear();
  }
}
