import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './user-role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private repo: Repository<UserRole>
  ) {}

  async create(roleData: Partial<UserRole>): Promise<UserRole> {
    const role = this.repo.create(roleData);
    return this.repo.save(role);
  }

  async findAll(): Promise<UserRole[]> {
    return this.repo.find();
  }

  async findOneById(id: number): Promise<UserRole> {
    const role = await this.repo.findOne({
      where: {
        id,
      }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findOneBySlug(slug: string): Promise<UserRole> {
    const role = await this.repo.findOne({
      where: {
        slug,
      }
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${slug} not found`);
    }
    return role;
  }

  async update(id: number, updateData: Partial<UserRole>): Promise<UserRole> {
    await this.repo.update(id, updateData);
    const updatedRole = await this.repo.findOne({
      where: {
        id,
      }
    });
    
    if (!updatedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return updatedRole;
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  public async clearAll(): Promise<void> {
    await this.repo.clear();
  }
}