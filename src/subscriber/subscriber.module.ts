import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { Subscriber } from './subscriber.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  providers: [SubscriberService, HashService],
  exports: [SubscriberService, TypeOrmModule],
})
export class SubscriberModule {}
