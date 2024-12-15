import { UserRole } from "@/user/entities/user-role.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
export declare class AdminUserRoleService {
    private readonly repo;
    private readonly logger;
    constructor(repo: Repository<UserRole>);
    find(query: FindManyOptions<UserRole>): Promise<UserRole[]>;
    findOne(query: FindOneOptions<UserRole>): Promise<UserRole>;
    findAll(): Promise<UserRole[]>;
    findOneBySlug(slug: string): Promise<UserRole>;
    delete(slug: string): Promise<UserRole>;
}
