import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { HashService } from 'src/hash/hash.service';
import { UserRole } from 'src/user/entities/user-role.entity';
import { UserRoleService } from 'src/user/services/user-role.service';
import { ProfileController } from './controllers/profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole,])],
  providers: [UserService, UserRoleService, HashService],
  exports: [UserService, UserRoleService, TypeOrmModule],
  controllers: [ ProfileController],
})
export class UserModule {}
