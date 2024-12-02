import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  
  import { AuthUser } from '../user/decorators/user.decorator';
  import { User } from '../user/entities/user.entity';
  import { AuthService } from './auth.service';
  import { SignUpDto } from './dto/sign-up.dto';
  import { JWTAuthGuard } from './guards/jwt-auth.guard';
  import { LocalAuthGuard } from './guards/local-auth.guard';
  import { TokenInterceptor } from './interceptors/token.interceptor';
  import { Public } from './guards/public.guard';
  import { IResponse, IResponseWithRelation } from 'src/interfaces/IResponse';
  import { Request } from 'express';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { IsGuestGuard } from './guards/is-guest.guard';

  @Controller('auth')
  @UseInterceptors(ClassSerializerInterceptor)
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    @UseGuards(IsGuestGuard)
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() signUp: SignUpDto): Promise<IResponseWithRelation<User>> {
      const data: User = await this.authService.register(signUp);

      const response: IResponseWithRelation<User> = {
        statusCode: 201,
        message: 'Registration successful',
        data,
      };

      return response;
    }
  
    @Post('login')
    @UseGuards(IsGuestGuard, LocalAuthGuard)
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
    @UseGuards(IsAuthenticatedGuard)
    async logout(@Req() request: Request): Promise<IResponse> {
      await this.authService.logout(request);
      
      const response: IResponse = {
        statusCode: 200,
        message: 'Logout successful'
      };

      return response;
    }
  
    @Get('/me')
    @UseGuards(IsAuthenticatedGuard)
    me(@AuthUser() user: User): IResponseWithRelation<User> {

      const response: IResponseWithRelation<User> = {
        statusCode: 200,
        message: 'Your profile.',
        data: user,
      };

      return response;
    }
    //http://localhost:3001/api/v1/auth/confirm-email?token=f8037db33301a9cc
    @Get('confirm-email')
    async confirmEmail(@Req() request: Request, @Query('token') token: string): Promise<IResponseWithRelation<User>> {
      if (!token) {
        const response: IResponse = {
          statusCode: 400,
          message: 'Token is required',
        };

        return response;
      }

      let user: User | null = await this.authService.findUserByEmailVerificationToken(token);

      if (!user) {
        const response: IResponse = {
          statusCode: 400,
          message: 'No user found for provided token, could token be expired or already claimed?',
        };

        return response;
      }

      if (user.emailVerified) {
        const response: IResponse = {
          statusCode: 400,
          message: 'Email already confirmed',
        };

        return response;
      }

      if (user.emailVerificationToken !== token) {
        const response: IResponse = {
          statusCode: 400,
          message: 'Invalid token',
        };

        return response;
      }

      user = await this.authService.confirmEmail(token);

      if (!user) {
        const response: IResponse = {
          statusCode: 400,
          message: 'Invalid token',
        };

        return response
      }

      const response: IResponseWithRelation<User> = {
        statusCode: 200,
        message: 'Email confirmed, You can close this window.',
        data: user,
      };

      return response;
    }
  }
  