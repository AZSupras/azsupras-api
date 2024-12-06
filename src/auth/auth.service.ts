import { ConflictException, HttpStatus, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IForgotPasswordValues, IResetPasswordValues, JwtPayload } from './interfaces/jwt-payload.interface';
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

      await this.userService.updateLastLogin(user.id)
      user = await this.userService.toggleOnlineStatus(user.id, true);

      delete user.password;
    } catch (err) {
      throw err;
    }

    profile = new IUser(user);
    return profile;
  }

  async logout(@Req() request: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let user: Partial<User> = request.user;
      user = await this.userService.toggleOnlineStatus(user.id, false);

      request.session.destroy(() => {
        resolve();
      });
    });
  }

  async forgotPassword(email: string): Promise<void> {
    return this.userService.forgotPassword(email)
      .then((user: User) => {
        const passwordResetEmail: CreateEmailDto = {
          to: user.email,
          template: 'password_reset',
          context: {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            token: user.passwordResetToken,
          },
        }

        const passwordResetEmailJob = this.emailQueue.add(passwordResetEmail);
      return;
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

  public async findUserByEmailVerificationToken(token: string): Promise<User> {
    return await this.userService.findUserByEmailVerificationToken(token);
  }

  async findUserByUserId(userId: string): Promise<User|null> {
    try {
      let user: User = await this.userService.findOneById(userId);
      return user;

    } catch(err) {
      throw new Error(err.message);
    }
  }

  async confirmEmail(token: string) {
    try {
      let user: User = await this.userService.confirmEmail(token);
      return user;
    } catch(err) {
      throw new Error(err.message);
    }
  }

  signToken(user: User): string {
    const payload = {
      sub: user.username,
    };

    return this.jwtService.sign(payload);
  }

  async resetPassword({ token, password }: IResetPasswordValues): Promise<User> {
    const user: User = await this.userService.resetPassword(token, password);

    return user;
  }
}