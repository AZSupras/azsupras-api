"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedData_AppConfig = exports.SeedData_Users = exports.SeedData_UserRoles = void 0;
exports.SeedData_UserRoles = [
    {
        slug: 'admin',
        name: 'Admin',
    },
    {
        slug: 'user',
        name: 'User',
    },
];
exports.SeedData_Users = [
    {
        username: 'admin',
        password: 'password',
        email: 'gordonfreeman@test.com',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        firstName: 'Gordon',
        lastName: 'Freeman',
        isPublic: false,
        roleSlugs: ['admin'],
    },
];
exports.SeedData_AppConfig = {
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
const SeedData = {
    userRoles: exports.SeedData_UserRoles,
    users: exports.SeedData_Users,
    appConfig: exports.SeedData_AppConfig,
};
exports.default = SeedData;
//# sourceMappingURL=SeederData.js.map