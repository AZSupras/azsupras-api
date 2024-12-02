import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

export class CreateAppConfigDto {
  @IsDefined()
  @IsNotEmpty()
  appName: string;
  @IsOptional()
  registrationEnabled: boolean;
  @IsOptional()
  emailVerificationRequired: boolean;
  @IsOptional()
  passwordResetEnabled?: boolean;
  @IsOptional()
  emailLoginEnabled?: boolean;
  @IsOptional()
  passwordMinLength?: number;
  @IsOptional()
  passwordAlphRequired?: boolean;
  @IsOptional()
  passwordNumRequired?: boolean;
  @IsOptional()
  passwordSpecialCharRequired?: boolean;
}
