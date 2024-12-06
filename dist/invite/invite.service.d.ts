import { HashService } from 'src/hash/hash.service';
import { Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { User } from 'src/user/entities/user.entity';
import { Queue } from 'bull';
export declare class InviteService {
    private repo;
    private hashService;
    private emailQueue;
    constructor(repo: Repository<Invite>, hashService: HashService, emailQueue: Queue);
    findAll(): Promise<Invite[]>;
    findOneById(id: string): Promise<Invite>;
    findOneByCode(code: string): Promise<Invite>;
    create(): Promise<Invite>;
    private _generateRandomAlphanumeric;
    private _isCodeUnique;
    private _generateUniqueCode;
    createMany(count: number): Promise<Invite[]>;
    update(id: string, data: Partial<Invite>): Promise<Invite>;
    use(id: string, user: User): Promise<Invite>;
    delete(id: string): Promise<Invite>;
    clearAll(): Promise<void>;
}
