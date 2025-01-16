import { Member } from "./member.entity";
export declare class MemberVehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    vin?: string;
    color?: string;
    member: Member;
}
