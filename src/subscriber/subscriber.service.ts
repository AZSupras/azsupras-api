import { Injectable } from '@nestjs/common';
import { Subscriber } from './subscriber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateSubscriberDto,
  UpdateSubscriberDto,
} from './create-subscriber.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private repo: Repository<Subscriber>,
    private hashService: HashService,
  ) {}

  public async findAll(): Promise<Subscriber[]> {
    const results = await this.repo.find();

    return results;
  }

  public async findOneById(id: string): Promise<Subscriber> {
    const results = await this.repo.findOne({
      where: { id },
    });

    return results;
  }

  public async findOneByEmail(email: string): Promise<Subscriber> {
    const results = await this.repo.findOne({ where: { email } });

    return results;
  }

  public async create(newSubscriber: CreateSubscriberDto): Promise<Subscriber> {
    let subscriber: Subscriber = new Subscriber();

    subscriber.email = newSubscriber.email;
    subscriber.firstName = newSubscriber.firstName;
    subscriber.lastName = newSubscriber.lastName;
    subscriber.subscribed = newSubscriber.subscribed;
    subscriber.unsubscribeToken = this.hashService.hashSync(subscriber.email);
    subscriber = this.repo.create(subscriber);

    await this.repo.save(subscriber);

    return subscriber;
  }

  public async update(
    id: string,
    data: UpdateSubscriberDto,
  ): Promise<Subscriber> {
    let updatedSubscriber: Subscriber = await this.repo.findOne({
      where: { id },
    });

    if (!updatedSubscriber) {
      throw new Error('Subscriber not found');
    }

    updatedSubscriber.email = data.email || updatedSubscriber.email;
    updatedSubscriber.firstName = data.firstName || updatedSubscriber.firstName;
    updatedSubscriber.lastName = data.lastName || updatedSubscriber.lastName;
    updatedSubscriber = await this.repo.save(updatedSubscriber);

    return updatedSubscriber;
  }

  public async subscribe(id: string): Promise<Subscriber> {
    let subscriber: Subscriber = await this.repo.findOne({
      where: { id },
    });

    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    if (subscriber.subscribed) {
      throw new Error('Subscriber already subscribed');
    }

    subscriber.subscribed = true;
    subscriber = await this.repo.save(subscriber);

    return subscriber;
  }

  public async unsubscribe(id: string): Promise<Subscriber> {
    let subscriber: Subscriber = await this.repo.findOne({
      where: { id, subscribed: true },
    });

    if (!subscriber) {
      return null;
    }

    subscriber.subscribed = false;
    subscriber.unsubscribedAt = new Date();

    subscriber = await this.repo.save(subscriber);

    return subscriber;
  }

  public async delete(id: string): Promise<Subscriber> {
    let subscriber: Subscriber = await this.repo.findOne({
      where: { id },
    });

    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    subscriber = await this.repo.remove(subscriber);

    return subscriber;
  }
}
