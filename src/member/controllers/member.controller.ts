import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MemberService } from '../services/member.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { IResponse, IResponseWithRelation } from '@/interfaces/IResponse';
import { Member } from '../entities/member.entity';
import { IsAdminGuard } from '@/auth/guards/is-admin.guard';
import { IsAuthenticatedGuard } from '@/auth/guards/is-authenticated.guard';
import { CreateMemberPhotoDto } from '../dto/create-member-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MemberPhoto } from '../entities/member-photo.entity';
import { MemberVehicle } from '../entities/member-vehicle.entity';
import { S3Service } from '@/s3/s3.service';
import { MemberDto } from '../dto/member.dto';

@Controller(['member', 'members'])
export class MemberController {
  constructor(private readonly memberService: MemberService, private readonly s3Service: S3Service) {}

  // get all members
  @Get()
  async findAll() {
    const data: MemberDto[] = await this.memberService.findAll()
      .then((members: Member[]  ) => {
        return members.map((member: Member) => {
          return {
            ...member,
            photo: member.photo ? member.photo.url : null,
          }
        });
      });

    const response: IResponseWithRelation<MemberDto[]> = {
      data: data,
      statusCode: 200,
      message: 'Members fetched successfully',
    }

    return response;
  }

  // get all vehicles
  @Get('vehicles')
  async getAllVehicles() {
    const data: MemberVehicle[] = await this.memberService.getAllVehicles();

    const response: IResponseWithRelation<MemberVehicle[]> = {
      data: data,
      statusCode: 200,
      message: 'Member vehicles fetched successfully',
    }

    return response;
  }

  // get all member vehicles
  @Get(':id/vehicles')
  async getMemberVehicles(@Param('id') id: string) {
    const data: MemberVehicle[] = await this.memberService.getMemberVehicles(id);

    const response: IResponseWithRelation<MemberVehicle[]> = {
      data: data,
      statusCode: 200,
      message: 'Member vehicles fetched successfully',
    }

    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data: Member = await this.memberService.findOneById(id);

    const response: IResponseWithRelation<Member> = {
      data: data,
      statusCode: 200,
      message: 'Member fetched successfully',
    }

    return response;
  }
}
