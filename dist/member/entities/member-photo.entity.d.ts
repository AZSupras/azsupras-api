import { Member } from "./member.entity";
export declare class MemberPhoto {
    id: string;
    memberId: string;
    url: string;
    createdAt: Date;
    updatedAt?: Date | null;
    member: Member;
}
