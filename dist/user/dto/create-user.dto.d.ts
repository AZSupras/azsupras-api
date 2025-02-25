import { UserPrivacySetting } from "@/member/types/UserPrivacySetting";
export declare class CreateUserDto {
    username: string;
    password: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
    email?: string | null;
    isPublic?: boolean | null;
    roleSlugs: string[];
    privacySettings?: UserPrivacySetting;
}
