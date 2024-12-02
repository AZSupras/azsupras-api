import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { PublicUserDto } from '../dto/public-user.dto';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { User } from '../entities/user.entity';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthUser } from '../decorators/user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { BanUserDto, UnbanUserDto } from '../dto/ban-user.dto';

@Controller(['user'])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('randomUsername')
  async generateRandomUsername() {
    const data: string = this.userService.generateRandomUsername();

    const results: IResponseWithRelation<string> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return results;
  }

  @Get('checkAvailable/:username')
  async checkUsernameAvailability(@Param('username') username: string) {
    const data: boolean = await this.userService.checkUsernameAvailability(
      username,
    );

    const results: IResponseWithRelation<boolean> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return results;
  }

  @Get()
  @UseGuards(AuthGuard, IsAdminGuard)
  async Admin_getAll(@AuthUser() user: User): Promise<IResponseWithRelation<User[]>> {
    const data: User[] = await this.userService.findAll();

    const results: IResponseWithRelation<User[]> = {
      statusCode: 200,
      message: 'Success',
      count: data.length,
      data,
    };

    return results;
  }

  @UseGuards(AuthGuard, IsAdminGuard)
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

  @UseGuards(AuthGuard, IsAdminGuard)
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

  @UseGuards(AuthGuard, IsAdminGuard)
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
