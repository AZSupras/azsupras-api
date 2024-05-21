import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { User } from 'src/user/user.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

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

    invite.code = this.hashService.hashSync(new Date().toISOString());
    invite = this.repo.create(invite);

    await this.repo.save(invite);

    return invite;
  }

  // create many invites
  public async createMany(count: number): Promise<Invite[]> {
    const invites: Invite[] = [];

    for (let i = 0; i < count; i++) {
      const invite: Invite = new Invite();
      invite.code = this.hashService.hashSync(new Date().toISOString());
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
}
