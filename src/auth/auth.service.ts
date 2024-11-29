import { ConflictException, HttpStatus, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { SignUp } from './dto/sign-up.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { IUser } from 'src/user/dto/user-profile.dto';
import { UserRole } from 'src/user-role/user-role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(signUp: SignUp): Promise<User> {
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