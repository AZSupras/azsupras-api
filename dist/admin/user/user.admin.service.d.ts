import { BanUserDto } from "src/admin/dto/ban-user.dto";
import { UserRole } from "src/user/entities/user-role.entity";
import { User } from "src/user/entities/user.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
export declare class AdminUserService {
    private readonly userRepo;
    private readonly roleRepo;
    private readonly logger;
    constructor(userRepo: Repository<User>, roleRepo: Repository<UserRole>);
    find(query: FindManyOptions<User>): Promise<User[]>;
    findOne(query: FindOneOptions<User>): Promise<User>;
    findAll(): Promise<User[]>;
    findOneByUsername(username: string): Promise<User>;
    banUser({ username, reason }: BanUserDto): Promise<User>;
    unbanUser(username: string): Promise<User>;
}
