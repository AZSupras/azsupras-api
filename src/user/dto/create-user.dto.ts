import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";
import { IsUserAlreadyExist } from "../validators/is-user-already-exist.validator";

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

  @IsEmail()
  email?: string | null;

  @IsString()
  firstName?: string | null;
  
  @IsString()
  lastName?: string | null;
  
  @IsBoolean()
  isPublic?: boolean | null;

  @IsString({ each: true })
  roleSlugs: string[];
}
