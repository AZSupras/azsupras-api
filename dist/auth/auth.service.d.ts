/// <reference types="cookie-parser" />
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { IResetPasswordValues, JwtPayload } from './interfaces/jwt-payload.interface';
import { IUser } from 'src/user/dto/user-profile.dto';
import { Queue } from 'bull';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private emailQueue;
    constructor(userService: UserService, jwtService: JwtService, emailQueue: Queue);
    register(signUp: SignUpDto): Promise<User>;
    login(identity: string, password: string): Promise<IUser>;
    logout(request: Request): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    verifyPayload(payload: JwtPayload): Promise<User>;
    findUserByEmailVerificationToken(token: string): Promise<User>;
    findUserByUserId(userId: string): Promise<User | null>;
    confirmEmail(token: string): Promise<User>;
    signToken(user: User): string;
    resetPassword({ token, password }: IResetPasswordValues): Promise<User>;
}
