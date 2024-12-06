import { User } from './user.entity';
export declare class UserRole {
    id: number;
    slug: string;
    name: string;
    users: User[];
}
