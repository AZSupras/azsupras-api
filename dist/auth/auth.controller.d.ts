/// <reference types="cookie-parser" />
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { IResponse, IResponseWithRelation } from 'src/interfaces/IResponse';
import { Request } from 'express';
import { IForgotPasswordValues, IResetPasswordValues } from './interfaces/jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(signUp: SignUpDto): Promise<IResponseWithRelation<User>>;
    login(user: User): Promise<IResponseWithRelation<User>>;
    logout(request: Request): Promise<IResponse>;
    me(user: User): IResponseWithRelation<User>;
    confirmEmail(request: Request, token: string): Promise<IResponseWithRelation<User>>;
    forgotPassword({ email }: IForgotPasswordValues): Promise<IResponse>;
    resetPassword(payload: IResetPasswordValues): Promise<IResponseWithRelation<User>>;
}
