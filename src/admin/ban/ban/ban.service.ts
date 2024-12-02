import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ban } from './ban.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BanService {
    constructor(
        @InjectRepository(Ban)
        private readonly banRepo: Repository<Ban>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    // async findOne
    public async findOne(id: string): Promise<Ban> {
        const ban = await this.banRepo.findOne({
            where: { id },
        });
        if (!ban) {
            throw new NotFoundException(`Ban with ID ${id} not found`);
        }
        return ban;
    }

    // async findAll
    public async findAll(): Promise<Ban[]> {
        return this.banRepo.find();
    }

    // async upsert
    public async upsert(banData: Partial<Ban>): Promise<Ban> {
        let ban = await this.banRepo.findOne({
            where: { id: banData.id },
        });
        if (ban) {
            ban = { ...ban, ...banData };
        } else {
            ban = this.banRepo.create(banData);
        }
        return this.banRepo.save(ban);
    }

    // async delete
    public async delete(id: string): Promise<void> {
        const result = await this.banRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Ban with ID ${id} not found`);
        }
    }
}
