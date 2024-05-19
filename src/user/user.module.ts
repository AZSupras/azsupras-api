import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { HashService } from 'src/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, HashService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
