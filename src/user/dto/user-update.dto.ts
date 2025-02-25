import { IsDefined, IsString, IsNotEmpty, IsBoolean, IsEmail, Validate, IsOptional } from 'class-validator';
import { IsUserAlreadyExist } from '../validators/is-user-already-exist.validator';

export class UserUpdate {
  @IsOptional()
  @IsString()
  firstName?: string;
  
  @IsOptional()
  @IsString()
  middleName?: string;
  
  @IsOptional()
  @IsString()
  lastName?: string;
  
  @IsOptional()
  @IsString()
  suffix?: string;
  
  @IsOptional()
  @IsEmail()
  readonly email?: string | null;
  
  @IsOptional()
  @IsBoolean()
  readonly isPublic?: boolean | null;
}
