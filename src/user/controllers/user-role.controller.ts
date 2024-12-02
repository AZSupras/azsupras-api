import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { PublicUserDto } from '../dto/public-user.dto';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { User } from '../entities/user.entity';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthUser } from '../decorators/user.decorator';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { UserRoleService } from '../services/user-role.service';
import { UserRole } from '../entities/user-role.entity';

@Controller(['role'])
export class UserRoleController {
  constructor(private readonly userService: UserService, private readonly userRoleService: UserRoleService) {}

  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Get()
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
  
  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Get('slug/:slug')
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
  
  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Get(':id')
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