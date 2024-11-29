import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { randomBytes } from 'crypto';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private repo: Repository<Invite>,
    private hashService: HashService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  public async findAll(): Promise<Invite[]> {
    const results = await this.repo.find();

    return results;
  }

  public async findOneById(id: string): Promise<Invite> {
    const results = await this.repo.findOne({
      where: { id },
    });

    return results;
  }

  public async findOneByCode(code: string): Promise<Invite> {
    const results = await this.repo.findOne({ where: { code, used: false } });

    return results;
  }

  // create a new invite
  public async create(): Promise<Invite> {
    let invite: Invite = new Invite();

    invite.code = await this._generateUniqueCode(16)
    invite = this.repo.create(invite);

    await this.repo.save(invite);

    return invite;
  }

  private _generateRandomAlphanumeric(length: number): string {
    return randomBytes(length / 2).toString('hex');
  }

  private async _isCodeUnique(code: string): Promise<boolean> {
    const count = await this.repo.count({ where: { code } });
    return count === 0;
  }

  private async _generateUniqueCode(length: number = 16): Promise<string> {
    let code: string;
    do {
      code = this._generateRandomAlphanumeric(length);
    } while (!(await this._isCodeUnique(code)));
    return code;
  }

  // create many invites
  public async createMany(count: number): Promise<Invite[]> {
    const invites: Invite[] = [];

    for (let i = 0; i < count; i++) {
      const invite: Invite = new Invite();
      invite.code = await this._generateUniqueCode();
      invites.push(invite);
    }

    await this.repo.save(invites);

    return invites;
  }

  // update an invite
  public async update(id: string, data: Partial<Invite>): Promise<Invite> {
    let updatedInvite: Invite = await this.repo.findOne({
      where: { id },
    });

    updatedInvite = this.repo.merge(updatedInvite, data);

    await this.repo.save(updatedInvite);

    return updatedInvite;
  }

  // mark an invite as used
  public async use(id: string, user: User): Promise<Invite> {
    const invite: Invite = await this.repo.findOne({
      where: { id },
    });

    invite.used = true;
    invite.usedAt = new Date();
    invite.user = user;

    await this.repo.save(invite);

    return invite;
  }

  // delete an invite
  public async delete(id: string): Promise<Invite> {
    const invite: Invite = await this.repo.findOne({
      where: { id },
    });

    await this.repo.delete(id);

    return invite;
  }

  public async clearAll(): Promise<void> {
    await this.repo.clear();
  }
}
