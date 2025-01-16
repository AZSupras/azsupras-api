import { IsNotEmpty, IsString } from "class-validator";

export class CreateMemberPhotoDto {
    @IsNotEmpty()
    @IsString()
    memberId: string;

    @IsNotEmpty()
    @IsString()
    url: string;
}