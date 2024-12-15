import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { PublicUserDto } from '../dto/public-user.dto';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { User } from '../entities/user.entity';
import { JWTAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { AuthUser } from '../decorators/user.decorator';
import { IsAuthenticatedGuard } from '@/auth/guards/is-authenticated.guard';
import { IsAdminGuard } from '@/auth/guards/is-admin.guard';
import { UserRoleService } from '../services/user-role.service';
import { UserRole } from '../entities/user-role.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller(['role'])
export class UserRoleController {
  constructor(private readonly userService: UserService, private readonly userRoleService: UserRoleService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  async getAll(@AuthUser() user: User): Promise<IResponseWithRelation<UserRole[]>> {
    const data: UserRole[] = await this.userRoleService.findAll();

    const results: IResponseWithRelation<UserRole[]> = {
      statusCode: 200,
      message: 'Success',
      count: data.length,
      data,
    };

    return results;
  }
  
  @Get('slug/:slug')
  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  async getOneBySlug(@Param('slug') slug: string) {
    const data: UserRole =
      await this.userRoleService.findOneBySlug(slug);

    const results: IResponseWithRelation<UserRole> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return results;
  }
  
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  async getOneById(@Param('id') id: number) {
    const data: UserRole =
      await this.userRoleService.findOneById(id);

    const results: IResponseWithRelation<UserRole> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return results;
  }
}