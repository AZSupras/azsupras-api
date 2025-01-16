import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
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
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IResponse, IResponseWithRelation } from '@/interfaces/IResponse';
import { Request } from 'express';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { IsGuestGuard } from './guards/is-guest.guard';
import { IForgotPasswordValues, IResetPasswordValues } from './interfaces/jwt-payload.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppConfigService } from '@/app-config/app-config.service';
import { AppConfig } from '@/app-config/entities/app-config.entity';

  @Controller('auth')
  @UseInterceptors(ClassSerializerInterceptor)
  export class AuthController {
    constructor(private readonly authService: AuthService, private readonly appConfigService: AppConfigService) {}
  
    @Post('register')
    @UseGuards(IsGuestGuard)
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() signUp: SignUpDto): Promise<IResponseWithRelation<User>> {
      // check if registration is enabled, if it is not we are only allowing registration with invite code
      const {
        registrationEnabled,
      }: AppConfig = await this.appConfigService.getLatest();

      // if registration is not enabled and no invite code is provided, we throw an error
      if (!registrationEnabled) {
        throw new BadRequestException('Registration is not currently enabled.');
      }
      
      // if registration is enabled, we can register the user without an invite code
      const data: User = await this.authService.register(signUp);

      const response: IResponseWithRelation<User> = {
        statusCode: 201,
        message: 'Registration successful',
        data,
      };

      return response;
    }
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    async login(@AuthUser() user: User): Promise<IResponseWithRelation<User>> {
      const response: IResponseWithRelation<User> = {
        statusCode: 200,
        message: 'Login successful',
        data: user,
      };

      return response;
    }

    @Get('logout')
    @ApiBearerAuth()
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
    @ApiBearerAuth()
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

      user = await this.authService.confirmEmail(user.id, token);

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

    @Post('forgot-password')
    @UseGuards(IsGuestGuard)
    @HttpCode(HttpStatus.CREATED)
    async forgotPassword(@Body() {email}: IForgotPasswordValues): Promise<IResponse> {
      return this.authService.forgotPassword(email)
      .then(() => {
        const r: IResponse = {
          statusCode: 200,
          message: 'Password reset link will be sent to your email.',
        }
        
        return r;  
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      })
    }

    @Post('reset-password')
    @UseGuards(IsGuestGuard)
    @HttpCode(HttpStatus.CREATED)
    async resetPassword(@Body() payload: IResetPasswordValues): Promise<IResponseWithRelation<User>> {
      return this.authService.resetPassword(payload)
      .then((data: User) => {
        const r: IResponseWithRelation<User> = {
          statusCode: 200,
          message: 'Password reset successful.',
          data,
        }
        
        return r;  
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      })
    }
  }
  