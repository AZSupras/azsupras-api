export declare class BanUserDto {
    username: string;
    reason: string;
    expiresAt?: Date | null;
    bannedBy?: string | null;
}
export declare class UnbanUserDto {
    username: string;
    unbannedBy?: string | null;
}
