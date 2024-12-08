import { User } from './user.entity';
export declare class Profile {
    id: number;
    website?: string | null;
    location?: string | null;
    user: User;
}
