import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private hashService: HashService,
  ) {}

  public async findAll(): Promise<User[]> {
    const results = await this.repo.find();

    return results;
  }

  public async findOneById(id: string): Promise<User> {
    const results = await this.repo.findOne({
      where: { id },
    });

    return results;
  }

  public async findOneByEmail(email: string): Promise<User> {
    const results = await this.repo.findOne({ where: { email } });

    return results;
  }

  public async findOneByUsername(username: string): Promise<User> {
    const results = await this.repo.findOne({ where: { username } });

    return results;
  }

  // create a new user
  public async create(newUser: User): Promise<User> {
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
}
