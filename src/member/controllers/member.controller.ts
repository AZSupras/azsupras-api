import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, BadRequestException, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
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
import { AuthUser } from '@/user/decorators/user.decorator';
import { User } from '@/user/entities/user.entity';

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

  @Get('me')
  @UseGuards(IsAuthenticatedGuard)
  async getMyMember(@AuthUser() user: User) {
    const data: Member = await this.memberService.findOne({ where: { userId: user.id }, relations: ['user'] });

    if (!data) {
      const response: IResponse = {
        statusCode: 404,
        message: 'Member not found',
      }

      return response;
    }

    const response: IResponseWithRelation<Member> = {
      data: data,
      statusCode: 200,
      message: 'Member fetched successfully',
    }

    return response;
  }

  @Put('me')
  @UseGuards(IsAuthenticatedGuard)
  async upsertMyMemberProfile(@AuthUser() user: User, @Body() updatesUser: UpdateMemberDto) {
    const data: Member = await this.memberService.upsert({ ...updatesUser, user: user, userId: user.id });

    const response: IResponseWithRelation<Member> = {
      data: data,
      statusCode: 200,
      message: 'Member created successfully',
    }

    return response;
  }

  @Get(':id')
  async getSingleMemberById(@Param('id') id: string) {
    const data: Member = await this.memberService.findOneById(id);

    const response: IResponseWithRelation<Member> = {
      data: data,
      statusCode: 200,
      message: 'Member fetched successfully',
    }

    return response;
  }

  // get all vehicles for a single member by id
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
}
