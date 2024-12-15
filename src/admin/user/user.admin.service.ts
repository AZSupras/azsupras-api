import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "@/logger/logger.service";
import { BanUserDto } from "@/admin/dto/ban-user.dto";
import { User } from "@/user/entities/user.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class AdminUserService {
    private readonly logger = new LoggerService(AdminUserService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    public async find(query: FindManyOptions<User>): Promise<User[]> {
        const results = await this.userRepo.find(query);
    
        return results;
    }
    
    public async findOne(query: FindOneOptions<User>): Promise<User> {
        const results = await this.userRepo.findOne(query);

        return results;
    }

    public async findAll(): Promise<User[]> {
        const results: User[] = await this.userRepo.find();

        return results;
    }

    public async findOneByUsername(username: string): Promise<User> {
        const results: User = await this.userRepo.findOne({
            where: {
                username
            }
        });

        return results;
    }

    public async deleteUser(username: string): Promise<User> {
        const user: User = await this.findOneByUsername(username);

        return user;
    }

    public async banUser({ username, reason }: BanUserDto): Promise<User> {
        if (!username) {
            throw new NotFoundException(`User not found.`);
        }

        if (!reason) {
            reason = 'No reason provided.';
        }

        const user: User = await this.findOneByUsername(username);

        if (!user) {
            throw new NotFoundException(`User '${username}' not found.`);
        }

        user.isBanned = true;
        user.bannedAt = new Date();
        user.bannedReason = reason;

        const bannedUser: User = await this.userRepo.save(user);

        return bannedUser;
    }

    public async unbanUser(username: string): Promise<User> {
        const user: User = await this.findOneByUsername(username);

        if (!user) {
            throw new NotFoundException(`User '${username}' not found.`);
        }

        user.isBanned = false;
        user.bannedAt = null;
        user.bannedReason = null;

        const unbannedUser: User = await this.userRepo.save(user);

        return unbannedUser;
    }
}