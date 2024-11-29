import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { HashService } from 'src/hash/hash.service';
import { PublicUserDto } from '../dto/public-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoggerService } from 'src/logger/logger.service';
import { UserRole } from 'src/user-role/user-role.entity';
import { UserRoleService } from 'src/user-role/user-role.service';

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

@Injectable()
export class UserService {
  private readonly logger = new LoggerService(UserService.name);

  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private userRoleService: UserRoleService,
    private hashService: HashService,
  ) { }

  public generateRandomUsername(): string {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${randomAdjective}${randomNoun}${randomNumber}`;
  }

  public async findAll(): Promise<User[]> {
    const query: FindManyOptions<User> = {
      relations: ['roles'],
    };
    const results = await this.repo.find(query);

    return results;
  }

  public async Public_findAll(): Promise<PublicUserDto[]> {
    const query: FindManyOptions<User> = {
      select: {
        username: true,
        roles: {
          slug: true,
          name: true,
        },
      },
      where: { isPublic: true },
    };

    const results: PublicUserDto[] = await this.repo.find(query);

    return results;
  }

  public async Public_findOneByUsername(
    username: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const query: FindOneOptions<User> = {
      where: {
        username,
        isPublic: true,
      },
      ...options,
    };

    const results = await this.repo.findOne(query);

    return results;
  }

  public async findOneById(
    id: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const query: FindOneOptions<User> = {
      where: { id },
      ...options,
    };

    const results = await this.repo.findOne(query);

    return results;
  }

  public async findOneByEmail(
    email: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const query: FindOneOptions<User> = {
      where: {
        email,
      },
      ...options,
    };

    const results = await this.repo.findOne(query);

    return results;
  }

  public async findOneByUsername(
    username: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const query: FindOneOptions<User> = {
      where: {
        username,
      },
      select: {
        username: true,
      },
      ...options,
    };

    const results = await this.repo.findOne(query);

    return results;
  }

  public async findOneByIdentity(identity: string, options?: FindOneOptions<User>): Promise<User> {
    // regexp check if identity is an email address or username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity);
    const query: FindOneOptions<User> = {
      where: {
        [isEmail ? 'email' : 'username']: identity,
      },
      relations: ['roles'],
      ...options
    };
    const user: User = await this.repo.findOne(query);

    return user;
  }

  public async findOneByIdentity_withPassword(identity: string, options?: FindOneOptions<User>): Promise<User> {
    // regexp check if identity is an email address or username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity);
    const query: FindOneOptions<User> = {
      where: {
        [isEmail ? 'email' : 'username']: identity,
      },
      select: {
        id: true,
        username: true,
        password: true,
        roles: {
          slug: true,
        },
      },
      relations: ['roles'],
      ...options
    };
    const user: User = await this.repo.findOne(query);

    return user;
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
  public async create(newUserDto: CreateUserDto, options?: FindOneOptions<User>): Promise<User> {
    const roles: UserRole[] = await this.userRoleService.findManyBySlugs(newUserDto.roleSlugs);

    if (!roles) {
      throw new InternalServerErrorException(`There are no user roles found for the provided role slugs '${newUserDto.roleSlugs}'.`);
    }

    const newUser: Partial<User> = {
      username: newUserDto.username || this.generateRandomUsername(),
      email: newUserDto.email,
      password: this.hashService.hashSync(newUserDto.password),
      roles: roles,
    };

    let user: User = this.repo.create(newUser);
    user = await this.repo.save(user);

    user = await this.findOneById(user.id);

    return user;
  }
  
  public async update(username: string, updateUserDto: Partial<User>, options?: FindOneOptions<User>): Promise<User> {
    const user: User = await this.findOneById(username);

    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found.`);
    }

    let updatedUser: User = await this.repo.save({
      ...user,
      ...updateUserDto,
    });

    updatedUser = await this.findOneById(updatedUser.id, options);

    return updatedUser;
  }

  public async clearAll(): Promise<void> {
    await this.repo.clear();
  }
}
