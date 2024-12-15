import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '@/user/entities/user-role.entity';
import { User } from '@/user/entities/user.entity';
import { SeederService } from './seeder.service';
import { HashService } from '@/hash/hash.service';
import { HashModule } from '@/hash/hash.module';
import { AppConfigModule } from '@/app-config/app-config.module';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [
    HashModule,
    LoggerModule,
    AppConfigModule,
    TypeOrmModule.forFeature([User, UserRole,]),
  ],
  providers: [HashService, SeederService],
  exports: [SeederService],
})
export class SeederModule {}
