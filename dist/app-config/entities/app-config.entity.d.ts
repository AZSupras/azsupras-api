import { BaseEntity } from 'typeorm';
export declare class AppConfig extends BaseEntity {
    id: string;
    appName: string;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    passwordResetEnabled: boolean;
    emailLoginEnabled: boolean;
    passwordMinLength: number;
    passwordAlphRequired: boolean;
    passwordNumRequired: boolean;
    passwordSpecialCharRequired: boolean;
    registrationOpenDate: Date;
}
