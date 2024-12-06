export interface JwtPayload {
    sub: string;
    iat: number;
    exp: number;
}
export declare class IForgotPasswordValues {
    readonly email: string;
}
export declare class IResetPasswordValues {
    readonly password: string;
    readonly confirmPassword: string;
    readonly token: string;
}
