import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  
  import { AuthUser } from '../user/decorators/user.decorator';
  import { User } from '../user/entities/user.entity';
  import { AuthService } from './auth.service';
  import { SignUp } from './dto/sign-up.dto';
  import { JWTAuthGuard } from './guards/jwt-auth.guard';
  import { LocalAuthGuard } from './guards/local-auth.guard';
  import { TokenInterceptor } from './interceptors/token.interceptor';
  import { Public } from './guards/public.guard';
  import { IResponse, IResponseWithRelation } from 'src/interfaces/IResponse';
  import { Request } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

  @Controller('auth')
  @UseInterceptors(ClassSerializerInterceptor)
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    @UseGuards(GuestGuard)
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() signUp: SignUp): Promise<IResponseWithRelation<User>> {
      const data: User = await this.authService.register(signUp);

      const response: IResponseWithRelation<User> = {
        statusCode: 201,
        message: 'Registration successful',
        data,
      };

      return response;
    }
  
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async login(@AuthUser() user: User): Promise<IResponseWithRelation<User>> {
      const response: IResponseWithRelation<User> = {
        statusCode: 200,
        message: 'Login successful',
        data: user,
      };

      return response;
    }

    @Get('logout')
    @UseGuards(AuthGuard)
    async logout(@Req() request: Request): Promise<IResponse> {
      await this.authService.logout(request);
      
      const response: IResponse = {
        statusCode: 200,
        message: 'Logout successful'
      };

      return response;
    }
  
    @Get('/me')
    @UseGuards(AuthGuard)
    me(@AuthUser() user: User): IResponseWithRelation<User> {

      const response: IResponseWithRelation<User> = {
        statusCode: 200,
        message: 'Your profile.',
        data: user,
      };

      return response;
    }
  }
  