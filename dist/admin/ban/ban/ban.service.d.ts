import { Ban } from './ban.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class BanService {
    private readonly banRepo;
    private readonly userRepo;
    constructor(banRepo: Repository<Ban>, userRepo: Repository<User>);
    findOne(id: string): Promise<Ban>;
    findAll(): Promise<Ban[]>;
    upsert(banData: Partial<Ban>): Promise<Ban>;
    delete(id: string): Promise<void>;
}
