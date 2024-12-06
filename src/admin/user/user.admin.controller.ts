import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { AdminUserService } from './user.admin.service';
import { User } from 'src/user/entities/user.entity';
import { BanUserDto, UnbanUserDto } from 'src/admin/dto/ban-user.dto';

@Controller(['admin/user', 'admin/users'])
export class AdminUserController {
    constructor(private readonly userService: AdminUserService) {}

    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @Get()
    async Admin_getAll(): Promise<IResponseWithRelation<User[]>> {
        const data: User[] = await this.userService.find({
          relations: {
            roles: true,
          }
        });

        const results: IResponseWithRelation<User[]> = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };

        return results;
    }
    
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @Get(':username')
    async Admin_getOneByUsername(@Param('username') username: string) {
      const data: User =
        await this.userService.findOneByUsername(username);
  
      const results: IResponseWithRelation<User> = {
        statusCode: 200,
        message: 'Success',
        data,
      };
  
      return results;
    }
  
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @Post('ban')
    async Admin_banUser(@Body() banUser: BanUserDto) {
      if (!banUser.username) {
        throw new Error('You must provide a username to ban');
      }
  
      if (!banUser.reason) {
        throw new Error('You must provide a reason for the ban');
      }
  
      if (banUser.username === 'admin') {
        throw new Error('You cannot ban the admin user');
      }
  
      // first look up the user
      let data: User | null = await this.userService.findOneByUsername(banUser.username);
  
      if (!data) {
        throw new Error('User not found');
      }
  
      if (data.isBanned) {
        return {
          statusCode: 200,
          message: 'User is already banned',
          data,
        }
      }
  
      data =
        await this.userService.banUser(banUser);
  
      const results: IResponseWithRelation<User> = {
        statusCode: 200,
        message: 'Successfully banned user',
        data,
      };
  
      return results;
    }
  
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @Post('unban')
    async Admin_unbanUser(@Body() banUser: UnbanUserDto) {
      if (!banUser.username) {
        throw new Error('You must provide a username to unban');
      }
  
      let data: User | null = await this.userService.findOneByUsername(banUser.username);
  
      if (!data) {
        throw new Error('User not found');
      }
  
      if (!data.isBanned) {
        return {
          statusCode: 200,
          message: 'User is not banned',
          data,
        }
      }
  
      data = 
        await this.userService.unbanUser(banUser.username);
  
      const results: IResponseWithRelation<User> = {
        statusCode: 200,
        message: 'Successfully unbanned user',
        data,
      };
  
      return results;
    }
}