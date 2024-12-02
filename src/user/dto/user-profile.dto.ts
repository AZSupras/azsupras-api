import { UserRole } from "../entities/user-role.entity";
import { User } from "../entities/user.entity";

export class IUser {
    id: string;
    username: string;
    roles: string[];
    isAdmin: boolean;
    lastLogin?: Date;
    isOnline?: boolean;

    constructor(user: Partial<User>) {
        this.id = user.id;
        this.username = user.username;
        this.roles = user.roles.map((role: UserRole) => role.slug);
        this.isAdmin = this.roles.includes('admin');
        this.lastLogin = user.lastLogin;
        this.isOnline = user.isOnline;
    }
}