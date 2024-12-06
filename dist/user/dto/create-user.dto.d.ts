export declare class CreateUserDto {
    username: string;
    password: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    isPublic?: boolean | null;
    roleSlugs: string[];
}
