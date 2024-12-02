import { UserRole } from "../entities/user-role.entity";
import { User } from "../entities/user.entity";

export class IUser {
    username: string;
    roles: string[];
    isAdmin: boolean;

    constructor(user: Partial<User>) {
        this.username = user.username;
        this.roles = user.roles.map((role: UserRole) => role.slug);
        this.isAdmin = this.roles.includes('admin');
    }
}