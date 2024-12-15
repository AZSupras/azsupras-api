import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { UserRole } from '@/user/entities/user-role.entity';
import { User } from '@/user/entities/user.entity';
import { Ban } from './ban.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Ban]),
  ],
  providers: [BanService]
})
export class BanModule {}
