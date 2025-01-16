import { MemberPhoto } from "./member-photo.entity";
import { MemberVehicle } from "./member-vehicle.entity";
export declare class Member {
    id: string;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    gender?: string;
    birthDate?: Date;
    privacySettings: object[];
    createdAt: Date;
    updatedAt?: Date | null;
    photo?: MemberPhoto;
    vehicles: MemberVehicle[];
}
