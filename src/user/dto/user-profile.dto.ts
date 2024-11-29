import { User } from "../user.entity";

export class UserProfileDto {
    username: string;
    roles: string[];

    firstName?: string;
    lastName?: string;
    email?: string;

    constructor(user: Partial<User>) {
        this.username = user.username;
        this.roles = user.roles.map(role => role.slug);

        this.firstName = user.firstName;
        this.lastName = user.lastName;        
        this.email = user.email;
    }
}