import { User } from "../entities/user.entity";
export declare class IUser {
    id: string;
    username: string;
    roles: string[];
    isAdmin: boolean;
    lastLogin?: Date;
    isOnline?: boolean;
    constructor(user: Partial<User>);
}
