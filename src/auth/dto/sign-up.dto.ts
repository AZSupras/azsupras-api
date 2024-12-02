import {
    IsDefined,
    IsNotEmpty,
    IsEmail,
    MinLength,
    Validate,
    IsOptional,
    Min,
    Max,
  } from 'class-validator';
import { IsUserAlreadyExist } from 'src/user/validators/is-user-already-exist.validator';
  
export class SignUpDto {
    @IsDefined()
    @IsNotEmpty()
    readonly username: string;
  
    @IsOptional()
    @IsEmail()
    readonly email?: string|null|undefined;
  
    @IsDefined()
    @IsNotEmpty()
    @MinLength(8)
    readonly password: string;

    @IsOptional()
    readonly firstName?: string|null;

    @IsOptional()
    readonly lastName?: string|null;
  }