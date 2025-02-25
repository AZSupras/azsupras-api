import { MemberPhoto } from "./member-photo.entity";
import { MemberVehicle } from "./member-vehicle.entity";
import { User } from "@/user/entities/user.entity";
export declare class Member {
    id: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
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
    userId?: string;
    privacySettings: object[];
    createdAt: Date;
    updatedAt?: Date | null;
    photo?: MemberPhoto;
    vehicles: MemberVehicle[];
    user?: User;
}
