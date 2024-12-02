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
import { JWTAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { Public } from 'src/auth/guards/public.guard';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { PublicUserDto } from '../dto/public-user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { AuthUser } from '../decorators/user.decorator';

@Controller('u')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly userService: UserService) {}



  @Put('')
  @UseGuards(IsAuthenticatedGuard)
  async updateMe(@AuthUser() user: User, @Body() updatesUser: UserUpdate): Promise<IResponseWithRelation<User>> {
    const data: User = await this.userService.update(user.username, updatesUser);

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
  
  @Get()
  @UseGuards(IsAuthenticatedGuard)
  async getMe(@AuthUser() user: User, @Req() req: Request): Promise<IResponseWithRelation<User>> {
    const data: User = user;3

    const results: IResponseWithRelation<User> = {
      statusCode: 200,
      message: 'Success',
      data,
    };

    return results;
  }

  @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
  @Put(':username')
  async updateUser(
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
}
