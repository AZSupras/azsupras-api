import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

export class BanUserDto {
    @IsDefined()
    @IsNotEmpty()
    username: string;
    
    @IsDefined()
    @IsNotEmpty()
    reason: string;

    @IsOptional()
    expiresAt?: Date | null;

    @IsOptional()
    bannedBy?: string | null;
}

export class UnbanUserDto {
    @IsDefined()
    @IsNotEmpty()
    username: string;
    @IsOptional()
    unbannedBy?: string | null;
}