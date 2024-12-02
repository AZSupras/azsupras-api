import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/user/entities/user-role.entity';
import { User } from 'src/user/entities/user.entity';
import { SeederService } from './seeder.service';
import { HashService } from 'src/hash/hash.service';
import { HashModule } from 'src/hash/hash.module';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { LoggerModule } from 'src/logger/logger.module';

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
