import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/user-role/user-role.entity';
import { User } from 'src/user/user.entity';
import { SeederService } from './seeder.service';
import { HashService } from 'src/hash/hash.service';
import { HashModule } from 'src/hash/hash.module';
import { AppConfigService } from 'src/app-config/app-config.service';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
  imports: [
    HashModule,
    AppConfigModule,
    TypeOrmModule.forFeature([User, UserRole]),
  ],
  providers: [HashService, SeederService],
  exports: [SeederService],
})
export class SeederModule { }
