import { CreateAppConfigDto } from "src/app-config/dto/create-app-config.dto";
import { CreateUserRoleDto } from "src/user/dto/create-user-role.dto";
import { CreateUserDto } from "src/user/dto/create-user.dto";
export type SeedUserDto = CreateUserDto & {
    roleSlugs: string[];
    emailVerifiedAt?: Date | null;
    emailVerified: boolean;
};
export type SeedData = {
    userRoles: CreateUserRoleDto[];
    users: SeedUserDto[];
    appConfig: CreateAppConfigDto;
};
export declare const SeedData_UserRoles: CreateUserRoleDto[];
export declare const SeedData_Users: SeedUserDto[];
export declare const SeedData_AppConfig: CreateAppConfigDto;
declare const SeedData: SeedData;
export default SeedData;
