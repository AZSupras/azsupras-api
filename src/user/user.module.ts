import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { HashService } from 'src/hash/hash.service';
import { UserController } from './user.controller';
import { UserRole } from 'src/user-role/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [UserService, HashService],
  exports: [UserService, TypeOrmModule],
  controllers: [UserController],
})
export class UserModule {}
