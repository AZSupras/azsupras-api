import { User } from 'src/user/entities/user.entity';
export declare class Invite {
    id: string;
    code: string;
    used: boolean;
    createdAt: Date;
    updatedAt: Date;
    usedAt: Date;
    inviteEmailSentAt: Date;
    user: User;
}
