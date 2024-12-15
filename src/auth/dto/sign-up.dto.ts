import {
    IsDefined,
    IsNotEmpty,
    IsEmail,
    MinLength,
    Validate,
    IsOptional,
    Min,
    Max,
    IsString,
  } from 'class-validator';
import { IsUserAlreadyExist } from '@/user/validators/is-user-already-exist.validator';
  
export class SignUpDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    readonly username: string;
  
    @IsDefined()
    @IsNotEmpty()
    @MinLength(8)
    readonly password: string;
  
    @IsOptional()
    @IsEmail()
    readonly email?: string|null|undefined;

    @IsOptional()
    readonly firstName?: string|null;

    @IsOptional()
    readonly lastName?: string|null;

    @IsOptional()
    @IsString()
    readonly inviteCode?: string|null;
  }