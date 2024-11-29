export class CreateAppConfigDto {
  appName: string;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  passwordResetEnabled?: boolean;
  emailLoginEnabled?: boolean;
  passwordMinLength?: number;
  passwordAlphRequired?: boolean;
  passwordNumRequired?: boolean;
  passwordSpecialCharRequired?: boolean;
}
