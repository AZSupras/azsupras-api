import { Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { PublicUserDto } from './dto/public-user.dto';
import { User } from './user.entity';
import { IResponse } from 'src/interfaces/IResponse';
import { create } from 'domain';
import { CreateUserDto } from './dto/create-user.dto';

@Controller(['user', 'u'])
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAll_Public() {
        const data: PublicUserDto[] = await this.userService.Public_findAll();

        const results : IResponse<PublicUserDto[]> = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        }
        
        return results;
    }

    @Get(':username')
    async getOneByUsername_Public(@Param('username') username: string) {
        const data: PublicUserDto = await this.userService.Public_findOneByUsername(username);

        const results : IResponse<PublicUserDto> = {
            statusCode: 200,
            message: 'Success',
            data,
        }
        
        return results;
    }
}
