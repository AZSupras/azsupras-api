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

  public generateRandomUsername(): string {
    const adjectives = [
      'Adventurous', 'Brave', 'Calm', 'Delightful', 'Eager', 'Faithful', 'Gentle', 'Happy', 'Inventive', 'Jolly',
      'Kind', 'Lively', 'Merry', 'Nice', 'Obedient', 'Proud', 'Quiet', 'Relieved', 'Silly', 'Thankful',
      'Victorious', 'Witty', 'Zealous', 'Angry', 'Bewildered', 'Clumsy', 'Defeated', 'Embarrassed', 'Fierce',
      'Grumpy', 'Helpless', 'Itchy', 'Jealous', 'Lazy', 'Mysterious', 'Nervous', 'Obnoxious', 'Panicky', 'Repulsive',
      'Scary', 'Thoughtless', 'Uptight', 'Worried', 'Agreeable', 'Brave', 'Calm', 'Delightful', 'Eager', 'Faithful',
      'Gentle', 'Happy', 'Inventive', 'Jolly', 'Kind', 'Lively', 'Merry', 'Nice', 'Obedient', 'Proud', 'Quiet',
      'Relieved', 'Silly', 'Thankful', 'Victorious', 'Witty', 'Zealous', 'Angry', 'Bewildered', 'Clumsy', 'Defeated',
      'Embarrassed', 'Fierce', 'Grumpy', 'Helpless', 'Itchy', 'Jealous', 'Lazy', 'Mysterious', 'Nervous', 'Obnoxious',
      'Panicky', 'Repulsive', 'Scary', 'Thoughtless', 'Uptight', 'Worried', 'Adventurous', 'Brave', 'Calm', 'Delightful',
      'Eager', 'Faithful', 'Gentle', 'Happy', 'Inventive', 'Jolly'
    ];
    
    const nouns = [
      'Tiger', 'Eagle', 'Shark', 'Lion', 'Panther', 'Wolf', 'Bear', 'Fox', 'Hawk', 'Falcon',
      'Leopard', 'Jaguar', 'Cheetah', 'Cougar', 'Lynx', 'Bobcat', 'Ocelot', 'Puma', 'Hyena', 'Jackal',
      'Coyote', 'Dingo', 'Otter', 'Beaver', 'Raccoon', 'Skunk', 'Badger', 'Weasel', 'Mink', 'Ferret',
      'Squirrel', 'Chipmunk', 'Hedgehog', 'Porcupine', 'Armadillo', 'Sloth', 'Anteater', 'Aardvark', 'Platypus', 'Kangaroo',
      'Wallaby', 'Koala', 'Possum', 'Wombat', 'Tasmanian', 'Devil', 'Mongoose', 'Meerkat', 'Lemur', 'Monkey',
      'Gorilla', 'Chimpanzee', 'Orangutan', 'Baboon', 'Gibbon', 'Macaque', 'Mandrill', 'Tamarin', 'Capuchin', 'Saki',
      'Howler', 'Spider', 'Squirrel', 'Marmoset', 'Tarsier', 'Aye-aye', 'Loris', 'Galago', 'Bushbaby', 'Pangolin',
      'Elephant', 'Rhinoceros', 'Hippopotamus', 'Giraffe', 'Zebra', 'Horse', 'Donkey', 'Mule', 'Camel', 'Llama',
      'Alpaca', 'Vicuna', 'Guanaco', 'Buffalo', 'Bison', 'Yak', 'Cow', 'Bull', 'Ox', 'Goat'
    ];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${randomAdjective}${randomNoun}${randomNumber}`;
  }

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

  public async checkUsernameAvailability(username: string): Promise<boolean> {
    const count: number = await this.repo.count({
      where: {
        username
      },
    });

    return (count === 0);
  }

  // create a new user
  public async create(newUserDto: CreateUserDto): Promise<User> {
    const roles = await this.roleRepo
    .createQueryBuilder('roles')
    .where('roles.slug IN (:...slugs)', { slugs: newUserDto.roleSlugs })
    .getMany();

    const newUser: Partial<User> = {
      username: newUserDto.username || this.generateRandomUsername(),
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
