import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateMemberVehicleDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    memberId: string;

    @IsNotEmpty()
    @IsString()
    make: string

    @IsNotEmpty()
    @IsString()
    model: string

    @IsNotEmpty()
    @IsNumber()
    year: number

    @IsOptional()
    @IsString()
    vin?: string

    @IsOptional()
    @IsString()
    color?: string
}