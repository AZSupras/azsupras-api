import { IsDefined, IsString, IsNotEmpty } from "class-validator";

export class CreateMessageDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    senderId: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    recipientId: string;
}