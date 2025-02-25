import { Module } from '@nestjs/common';
import { MemberService } from './services/member.service';
import { MemberController } from './controllers/member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MemberPhoto } from './entities/member-photo.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MemberVehicle } from './entities/member-vehicle.entity';
import { S3Module } from '@/s3/s3.module';
import { MemberVehicleController } from './controllers/member-vehicle.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberPhoto, MemberVehicle]),
    S3Module,
  ],
  controllers: [MemberController, MemberVehicleController],
  providers: [MemberService],
  exports: [MemberService, TypeOrmModule],
})
export class MemberModule {}
