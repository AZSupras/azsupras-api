import {
    IsDefined,
    IsNotEmpty,
    IsEmail,
    MinLength,
    Validate,
  } from 'class-validator';
import { IsUserAlreadyExist } from 'src/user/validators/is-user-already-exist.validator';
  
export class SignUp {
    @IsDefined()
    @IsNotEmpty()
    readonly username: string;
  
    readonly email?: string|null|undefined;
  
    @IsDefined()
    @IsNotEmpty()
    @MinLength(8)
    readonly password: string;

    firstName?: string|null;
    lastName?: string|null;
  }