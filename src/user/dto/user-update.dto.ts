import { IsDefined, IsString, IsNotEmpty, IsBoolean, IsEmail, Validate } from 'class-validator';
import { IsUserAlreadyExist } from '../validators/is-user-already-exist.validator';

export class UserUpdate {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Validate(IsUserAlreadyExist)
  readonly username: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEmail()
  readonly email?: string | null;

  @IsString()
  readonly firstName?: string | null;
  
  @IsString()
  readonly lastName?: string | null;
  
  @IsBoolean()
  readonly isPublic?: boolean | null;

  @IsString({ each: true })
  readonly roleSlugs: string[];
}
