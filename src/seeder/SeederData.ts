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

export const SeedData_UserRoles: CreateUserRoleDto[] = [
    {
        slug: 'admin',
        name: 'Admin',
    },
    {
        slug: 'user',
        name: 'User',
    },
];

export const SeedData_Users: SeedUserDto[] = [
    {
        username: 'admin',
        password: 'password',
        email: 'gordonfreeman@test.com',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        firstName: 'Gordon',
        lastName: 'Freeman',
        isPublic: false,
        roleSlugs: ['admin', 'user'],
    },
];

export const SeedData_AppConfig: CreateAppConfigDto = {
    appName: 'My App',
    registrationEnabled: false,
    emailVerificationRequired: false,
    passwordResetEnabled: false,
    emailLoginEnabled: true,
    passwordMinLength: 8,
    passwordAlphRequired: false,
    passwordNumRequired: false,
    passwordSpecialCharRequired: false,
};

const SeedData: SeedData = {
    userRoles: SeedData_UserRoles,
    users: SeedData_Users,
    appConfig: SeedData_AppConfig,
};

export default SeedData