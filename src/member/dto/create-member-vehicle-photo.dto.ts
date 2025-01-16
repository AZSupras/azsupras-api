import { IsNotEmpty, IsString } from "class-validator";

export class CreateMemberVehiclePhotoDto {
    @IsNotEmpty()
    @IsString()
    vehicleId: string;

    @IsNotEmpty()
    @IsString()
    photoUrl: string;
}