import { User } from "@/user/entities/user.entity";
export declare class Message {
    id: string;
    subject: string;
    content: string;
    senderId: string;
    recipientId: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt?: Date | null;
    sender: User;
    recipient: User;
}
