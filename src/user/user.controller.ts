import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { PublicUserDto } from './dto/public-user.dto';
import { IResponseWithRelation } from 'src/interfaces/IResponse';

@Controller(['user', 'u'])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll_Public() {
    const data: PublicUserDto[] = await this.userService.Public_findAll();

    const results: IResponseWithRelation<PublicUserDto[]> = {
      statusCode: 200,
      message: 'Success',
      count: data.length,
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

  @Get(':username')
  async getOneByUsername_Public(@Param('username') username: string) {
    const data: PublicUserDto =
      await this.userService.Public_findOneByUsername(username);

    const results: IResponseWithRelation<PublicUserDto> = {
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
}
