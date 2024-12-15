import { IUser } from "@/user/dto/user-profile.dto";

export interface LoginPayload {
    user: IUser;
    token: string;
}