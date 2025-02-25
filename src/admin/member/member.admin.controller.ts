
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, InternalServerErrorException, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreateMemberDto } from '@/member/dto/create-member.dto';
import { UpdateMemberDto } from '@/member/dto/update-member.dto';
import { IResponse, IResponseWithRelation } from '@/interfaces/IResponse';
import { Member } from '@/member/entities/member.entity';
import { IsAdminGuard } from '@/auth/guards/is-admin.guard';
import { IsAuthenticatedGuard } from '@/auth/guards/is-authenticated.guard';
import { CreateMemberPhotoDto } from '@/member/dto/create-member-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MemberPhoto } from '@/member/entities/member-photo.entity';
import { MemberVehicle } from '@/member/entities/member-vehicle.entity';
import { S3Service } from '@/s3/s3.service';
import { AdminMemberService } from './member.admin.service';
import { User } from '@/user/entities/user.entity';
import { AdminUserService } from '../user/user.admin.service';

@Controller(['admin/member', 'admin/members'])
export class AdminMemberController {
  constructor(private readonly memberService: AdminMemberService, private readonly userService: AdminUserService, private readonly s3Service: S3Service) {}

    // get all members
    @Get()
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    async findAll() {
        const data: Member[] = await this.memberService.findAll();

        const response: IResponseWithRelation<Member[]> = {
        data: data,
        statusCode: 200,
        message: 'Members fetched successfully',
        }

        return response;
    }

    @Post()
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    async create(@Body() createMemberDto: CreateMemberDto) {
        try {
            if (createMemberDto.userId) {
              const existingMember = await this.memberService.findOne({ where: { userId: createMemberDto.userId } });

              if (existingMember) {
                throw new BadRequestException('Member already exists for this user');
              }

              const existingUser: User = await this.userService.findOneById(createMemberDto.userId);
            }
            const data: Member = await this.memberService.create(createMemberDto);

            const response: IResponseWithRelation<Member> = {
            data: data,
            statusCode: 200,
            message: 'Member created successfully',
            }

            return response;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch(':id')
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
        const data: Member = await this.memberService.update(id, updateMemberDto);

        const response: IResponseWithRelation<Member> = {
            data: data,
            statusCode: 200,
            message: 'Member updated successfully',
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

    @Delete(':id')
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    async remove(@Param('id') id: string) {
        const data: Member = await this.memberService.remove(id);

        const response: IResponseWithRelation<Member> = {
            data: data,
            statusCode: 200,
            message: 'Member deleted successfully',
        }

        return response;
    }


    @Post(':id/photo/upload')
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        if (!id) {
            throw new BadRequestException('Member ID is required');
        }

        try {    
            // check if photo already exists
            const existingPhoto = await this.memberService.getMemberPhoto(id);
            
            // if it does exists, remove it from database and from s3
            if (existingPhoto) {
            await this.memberService.removeMemberPhoto(id)
            await this.s3Service.deleteFile(existingPhoto.url);
            }

            // upload new photo
            const uploadedFile = await this.s3Service.uploadFile(file, `members/${id}/photo`);

            const addPhotoDto: CreateMemberPhotoDto = {
            memberId: id,
            url: uploadedFile.Location,
            }

            // create new photo in database
            const data: MemberPhoto = await this.memberService.createPhoto(addPhotoDto);

            const response: IResponseWithRelation<MemberPhoto> = {
            data: data,
            statusCode: 200,
            message: 'Member photo uploaded successfully',
            }
            
            return response;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
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