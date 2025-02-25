import {
  Controller,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  ParseIntPipe,
  Put,
  Body,
  Req,
  Request,
} from '@nestjs/common';

import { UserUpdate } from '../dto/user-update.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { Public } from '@/auth/guards/public.guard';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { PublicUserDto } from '../dto/public-user.dto';
import { IsAdminGuard } from '@/auth/guards/is-admin.guard';
import { IsAuthenticatedGuard } from '@/auth/guards/is-authenticated.guard';
import { AuthUser } from '../decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller(['u','user', 'profile', 'p'])
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(IsAuthenticatedGuard)
  @ApiBearerAuth()
  async getMe(@AuthUser() user: User, @Req() req: Request): Promise<IResponseWithRelation<User>> {
    const data: User = await this.userService.findOneByUsername(user.username, {
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        suffix: true,
        username: true,
        email: true,
        isBanned: true,
        bannedAt: true,
        bannedReason: true,
        isVerified: true,
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
        website: true,
        location: true,
        subscriber: {
          email: true,
          firstName: true,
          lastName: true,
          subscribed: true,
          unsubscribeToken: true,
          unsubscribedAt: true,
          subscribeEmailSentAt: true,
          unsubscribeEmailSentAt: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          emails: true,
        },
        roles: {
          name: true,
          slug: true,
        },
        bans: true,
        sentMessages: true,
        receivedMessages: true,
        member: {
          firstName: true,
          middleName: true,
          lastName: true,
          suffix: true,
          email: true,
          phone: true,
          address1: true,
          address2: true,
          city: true,
          state: true,
          zip: true,
          country: true,
          gender: true,
          birthDate: true,
          userId: true,
          privacySettings: true,
          createdAt: true,
          updatedAt: true,
          photo: {
            url: true,
            createdAt: true,
            updatedAt: true,
          },
          vehicles: true,
        },
        privacySettings: {
          firstNameVisible: true,
          lastNameVisible: true,
          middleNameVisible: true,
          suffixVisible: true,
          emailVisible: true,
          isPublic: true,
        },
      },
    });

    const results: IResponseWithRelation<User> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return results;
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(IsAuthenticatedGuard)
  async updateMe(@AuthUser() user: User, @Body() updatesUser: UserUpdate): Promise<IResponseWithRelation<User>> {
    const data: User = await this.userService.update(user.username, updatesUser, {
      select: {
        id: true,
        username: true,
        firstName: true,
        middleName: true,
        lastName: true,
        suffix: true,
        email: true,
        isBanned: true,
        bannedAt: true,
        bannedReason: true,
        isVerified: true,
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
        website: true,
        location: true,
        subscriber: {
          email: true,
          firstName: true,
          lastName: true,
          subscribed: true,
          unsubscribeToken: true,
          unsubscribedAt: true,
          subscribeEmailSentAt: true,
          unsubscribeEmailSentAt: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          emails: true,
        },
        roles: {
          name: true,
          slug: true,
        },
        bans: true,
        sentMessages: true,
        receivedMessages: true,
        member: {
          firstName: true,
          middleName: true,
          lastName: true,
          suffix: true,
          email: true,
          phone: true,
          address1: true,
          address2: true,
          city: true,
          state: true,
          zip: true,
          country: true,
          gender: true,
          birthDate: true,
          userId: true,
          privacySettings: true,
          createdAt: true,
          updatedAt: true,
          photo: {
            url: true,
            createdAt: true,
            updatedAt: true,
          },
          vehicles: true,
        },
        privacySettings: {
          firstNameVisible: true,
          lastNameVisible: true,
          middleNameVisible: true,
          suffixVisible: true,
          emailVisible: true,
          isPublic: true,
        },
      },
    });

    const results: IResponseWithRelation<User> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return results;
  }

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
    if (!username) {
      return {
        statusCode: 400,
        message: 'Username is required',
        data: false,
      };
    }

    if (username.length < 3) {
      return {
        statusCode: 400,
        message: 'Username must be at least 3 characters long',
        data: false,
      };
    }

    if (username.length > 20) {
      return {
        statusCode: 400,
        message: 'Username must be at most 20 characters long',
        data: false,
      };
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return {
        statusCode: 400,
        message: 'Username must contain only letters and numbers',
        data: false,
      };
    }

    if (username.includes(' ')) {
      return {
        statusCode: 400,
        message: 'Username must not contain spaces',
        data: false,
      };
    }

    const reservedWords = ['admin', 'moderator', 'system', 'support', 'help', 'root', 'administrator'];
    if (reservedWords.some(word => username.toLowerCase().includes(word))) {
      return {
        statusCode: 400,
        message: 'Username contains reserved words',
        data: false,
      };
    }

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

  @Public()
  @Get(':username')
  async get(@Param('username') username: string): Promise<IResponseWithRelation<PublicUserDto>> {
    const data: PublicUserDto = await this.userService.Public_findOneByUsername(username);
    if (!data) {
      return {
        statusCode: 404,
        message: 'User not found',
        data: null,
      };
    }

    const results: IResponseWithRelation<PublicUserDto> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return results;
  }
}
