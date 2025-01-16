import { IsDefined, IsString, IsNotEmpty, IsEmail, IsOptional, IsDate, IsDateString } from "class-validator"

export class CreateMemberDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName?: string | null;

    @IsEmail()
    @IsOptional()
    email?: string | null;

    @IsString()
    @IsOptional()
    phone?: string | null;

    @IsString()
    @IsOptional()
    address1?: string | null;

    @IsString()
    @IsOptional()
    address2?: string | null;

    @IsString()
    @IsOptional()
    city?: string | null;

    @IsString()
    @IsOptional()
    state?: string | null;

    @IsString()
    @IsOptional()
    zip?: string | null;

    @IsString()
    @IsOptional()
    country?: string | null;

    @IsString()
    @IsOptional()
    gender?: string | null;
    
    @IsDateString()
    @IsOptional()
    birthDate?: Date | null;

    @IsDate()
    @IsOptional()
    createdAt?: Date | null;

    @IsDate()
    @IsOptional()
    updatedAt?: Date | null;
}
