import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';
export declare class UserRoleService {
    private repo;
    constructor(repo: Repository<UserRole>);
    create(roleData: Partial<UserRole>): Promise<UserRole>;
    findAll(): Promise<UserRole[]>;
    findManyBySlugs(slugs: string[]): Promise<UserRole[]>;
    findOneById(id: number): Promise<UserRole>;
    findOneBySlug(slug: string): Promise<UserRole>;
    update(id: number, updateData: Partial<UserRole>): Promise<UserRole>;
    remove(id: number): Promise<void>;
    clearAll(): Promise<void>;
}
