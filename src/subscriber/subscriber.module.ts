import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { Subscriber } from './subscriber.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { SubscriberController } from './subscriber.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber]),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [SubscriberService, HashService],
  exports: [SubscriberService, TypeOrmModule],
  controllers: [SubscriberController],
})
export class SubscriberModule {}
