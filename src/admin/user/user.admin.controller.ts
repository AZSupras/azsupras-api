import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from '@/auth/guards/is-authenticated.guard';
import { IsAdminGuard } from '@/auth/guards/is-admin.guard';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { AdminUserService } from './user.admin.service';
import { User } from '@/user/entities/user.entity';
import { BanUserDto, UnbanUserDto } from '@/admin/dto/ban-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserUpdate } from '@/user/dto/user-update.dto';

@ApiBearerAuth()
@Controller(['admin/user', 'admin/users'])
export class AdminUserController {
  constructor(private readonly userService: AdminUserService) { }

  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Get()
  async Admin_getAllUsers(): Promise<IResponseWithRelation<User[]>> {
    const data: User[] = await this.userService.find({
      select: {
        id: true,
        username: true,
        email: true,
        isBanned: true,
        bannedAt: true,
        bannedReason: true,
        isOnline: true,
        emailVerified: true,
        emailVerificationToken: true,
        emailVerifiedAt: true,
        passwordResetToken: true,
        passwordResetExpires: true,
        passwordResetRequestedAt: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        inviteId: true,
        roles: true,
        bans: true,
        sentMessages: true,
        receivedMessages: true,
        privacySettings: {
          firstNameVisible: true,
          lastNameVisible: true,
          middleNameVisible: true,
          suffixVisible: true,
          emailVisible: true,
          isPublic: true,
        },
      },
      relations: {
        roles: true,
        member: true,
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
  async Admin_getOneUserByUsername(@Param('username') username: string) {
    const data: User =
      await this.userService.findOne({
        where: {
          username
        },
        select: {
          id: true,
          username: true,
          email: true,
          isBanned: true,
          bannedAt: true,
          bannedReason: true,
          isOnline: true,
          emailVerified: true,
          emailVerificationToken: true,
          emailVerifiedAt: true,
          passwordResetToken: true,
          passwordResetExpires: true,
          passwordResetRequestedAt: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          inviteId: true,
          roles: true,
          bans: true,
          sentMessages: true,
          receivedMessages: true,
          privacySettings: {
            firstNameVisible: true,
            lastNameVisible: true,
            middleNameVisible: true,
            suffixVisible: true,
            emailVisible: true,
            isPublic: true,
          },
        },
        relations: {
          roles: true,
          bans: true,
          sentMessages: true,
          receivedMessages: true,
        }
      });

    const results: IResponseWithRelation<User> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return results;
  }

  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Put(':username')
  @ApiBearerAuth()
  async Admin_updateUser(
    @Param('username') username: string,
    @Body() updatesUser: UserUpdate,
  ): Promise<IResponseWithRelation<User>> {
    const data: User = await this.userService.update(username, updatesUser);

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

  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Delete(':username')
  async Admin_deleteUser(@Param('username') username: string) {
    const data: User = await this.userService.deleteUser(username);

    if (!data) {
      throw new Error('User not found');
    }

    const results: IResponseWithRelation<User> = {
      statusCode: 200,
      message: 'Successfully deleted user',
      data,
    };

    return results;
  }
}
