import { BanUserDto } from "@/admin/dto/ban-user.dto";
import { User } from "@/user/entities/user.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
export declare class AdminUserService {
    private readonly userRepo;
    private readonly logger;
    constructor(userRepo: Repository<User>);
    find(query: FindManyOptions<User>): Promise<User[]>;
    findOne(query: FindOneOptions<User>): Promise<User>;
    findAll(): Promise<User[]>;
    findOneByUsername(username: string): Promise<User>;
    deleteUser(username: string): Promise<User>;
    banUser({ username, reason }: BanUserDto): Promise<User>;
    unbanUser(username: string): Promise<User>;
}
