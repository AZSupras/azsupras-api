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
}
