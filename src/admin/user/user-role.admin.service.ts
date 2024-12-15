import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "@/logger/logger.service";
import { BanUserDto } from "@/admin/dto/ban-user.dto";
import { UserRole } from "@/user/entities/user-role.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class AdminUserRoleService {
    private readonly logger = new LoggerService(AdminUserRoleService.name);

    constructor(
        @InjectRepository(UserRole)
        private readonly repo: Repository<UserRole>,
    ) { }

    public async find(query: FindManyOptions<UserRole>): Promise<UserRole[]> {
        const results = await this.repo.find(query);
    
        return results;
    }
    
    public async findOne(query: FindOneOptions<UserRole>): Promise<UserRole> {
        const results = await this.repo.findOne(query);

        return results;
    }

    public async findAll(): Promise<UserRole[]> {
        const results: UserRole[] = await this.repo.find();

        return results;
    }

    public async findOneBySlug(slug: string): Promise<UserRole> {
        const results: UserRole = await this.repo.findOne({
            where: {
                slug
            }
        });

        return results;
    }

    public async delete(slug: string): Promise<UserRole> {
        const results: UserRole = await this.findOneBySlug(slug);

        return results;
    }
}