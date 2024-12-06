import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { HashService } from 'src/hash/hash.service';
import { UserRole } from 'src/user/entities/user-role.entity';
import { UserRoleService } from 'src/user/services/user-role.service';
import { ProfileController } from './controllers/profile.controller';
import { BullModule } from '@nestjs/bull';
import { UserProcessor } from './user.processor';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole,]),],
  providers: [UserService, UserRoleService, HashService, UserProcessor,],
  exports: [UserService, UserRoleService, UserProcessor, TypeOrmModule],
  controllers: [ ProfileController],
})
export class UserModule {}
