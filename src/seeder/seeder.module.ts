import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/user-role/user-role.entity';
import { User } from 'src/user/user.entity';
import { SeederService } from './seeder.service';
import { HashService } from 'src/hash/hash.service';
import { HashModule } from 'src/hash/hash.module';

@Module({
  imports: [
    HashModule,
    TypeOrmModule.forFeature([User, UserRole]),
  ],
  providers: [HashService, SeederService],
  exports: [SeederService],
})
export class SeederModule { }
