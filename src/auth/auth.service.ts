import { ConflictException, HttpStatus, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { IUser } from 'src/user/dto/user-profile.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateEmailDto } from 'src/email/create-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async register(signUp: SignUpDto): Promise<User> {
    const existingUser = await this.userService.findOneByIdentity(signUp.username);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    
    const createUserDto: CreateUserDto = {
      username: signUp.username,
      email: signUp.email,
      password: signUp.password,
      firstName: signUp.firstName,
      lastName: signUp.lastName,
      roleSlugs: ['user'],
    };

    const user = await this.userService.create(createUserDto);
    delete user.password;

    if (user.email) {
      
      const welcomeEmail: CreateEmailDto = {
        to: user.email,
        template: 'welcome',
        context: {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      }

      const confirmEmail: CreateEmailDto = {
        to: user.email,
        template: 'confirm_email',
        context: {
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      }

      const welcomeEmailJob = this.emailQueue.add(welcomeEmail);
      const confirmEmailJob = this.emailQueue.add(confirmEmail);

      await Promise.all([welcomeEmailJob, confirmEmailJob]);
      console.log('Emails sent');
    }

    return user;
  }

  async login(identity: string, password: string): Promise<IUser> {
    let user: User;
    let profile: IUser;

    try {
      user = await this.userService.findOneByIdentity_withPassword(identity)

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (user.isBanned) {
        throw new UnauthorizedException('Unable to perform login, this account has been banned.');
      }

      const isPasswordValid = await user.checkPassword(password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      delete user.password;
    } catch (err) {
      throw err;
    }

    profile = new IUser(user);
    return profile;
  }

  async logout(@Req() request: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      request.session.destroy(() => {
        resolve();
      });
    });
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;

    try {
      user = await this.userService.findOneByIdentity(payload.sub);
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`,
      );
    }

    return user;
  }

  signToken(user: User): string {
    const payload = {
      sub: user.username,
    };

    return this.jwtService.sign(payload);
  }
}