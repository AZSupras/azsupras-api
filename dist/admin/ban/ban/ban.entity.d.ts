import { User } from "src/user/entities/user.entity";
export declare class Ban {
    id: string;
    username: string;
    reason: string;
    expiresAt: Date | null;
    isPermanent: boolean;
    isActive: boolean;
    bannedBy: User;
    user: User;
    createdAt: Date;
}
