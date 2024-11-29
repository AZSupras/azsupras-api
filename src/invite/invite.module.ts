import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { User } from 'src/user/user.entity';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from 'rxjs';
import { Invite } from './invite.entity';
import { HashService } from 'src/hash/hash.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber, Invite, User]),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [InviteService, HashService],
  exports: [InviteService, TypeOrmModule],
  controllers: [InviteController],
})
export class InviteModule {}
