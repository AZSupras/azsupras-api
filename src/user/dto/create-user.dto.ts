import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { IsUserAlreadyExist } from "../validators/is-user-already-exist.validator";
import { UserPrivacySetting } from "@/member/types/UserPrivacySetting";

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Validate(IsUserAlreadyExist)
  username: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  middleName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsString()
  suffix?: string

  @IsOptional()
  @IsEmail()
  email?: string | null;
  
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean | null;

  @IsString({ each: true })
  roleSlugs: string[];

  @IsOptional()
  privacySettings?: UserPrivacySetting;
}
