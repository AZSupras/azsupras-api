import { Module } from '@nestjs/common';
import { AdminMemberController } from './member.admin.controller';
import { AdminMemberService } from './member.admin.service';
import { MemberPhoto } from '@/member/entities/member-photo.entity';
import { MemberVehicle } from '@/member/entities/member-vehicle.entity';
import { Member } from '@/member/entities/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from '@/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberPhoto, MemberVehicle]),
    S3Module,
  ],
  providers: [AdminMemberService],
  controllers: [
    AdminMemberController,
  ],
  exports: [AdminMemberService, TypeOrmModule],
})
export class AdminMemberModule {}