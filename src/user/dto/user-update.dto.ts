import { IsDefined, IsString, IsNotEmpty, IsBoolean, IsEmail, Validate, IsOptional } from 'class-validator';
import { IsUserAlreadyExist } from '../validators/is-user-already-exist.validator';

export class UserUpdate {
  @IsOptional()
  @IsEmail()
  readonly email?: string | null;

  @IsOptional()
  @IsString()
  readonly firstName?: string | null;
  
  @IsOptional()
  @IsString()
  readonly lastName?: string | null;
  
  @IsOptional()
  @IsBoolean()
  readonly isPublic?: boolean | null;
}
