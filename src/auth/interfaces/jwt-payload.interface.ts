import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export interface JwtPayload {
    sub: string;
    iat: number;
    exp: number;
}

export class IForgotPasswordValues {
    @IsDefined()
    @IsNotEmpty()
    readonly email: string;
}

export class IResetPasswordValues {
    @IsDefined()
    @IsNotEmpty()
    readonly password: string;
    
    @IsDefined()
    @IsNotEmpty()
    readonly confirmPassword: string;
  
    @IsDefined()
    @IsNotEmpty()
    readonly token: string;
}