import { UserUpdate } from '../dto/user-update.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { PublicUserDto } from '../dto/public-user.dto';
export declare class ProfileController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(user: User, req: Request): Promise<IResponseWithRelation<User>>;
    updateMe(user: User, updatesUser: UserUpdate): Promise<IResponseWithRelation<User>>;
    generateRandomUsername(): Promise<IResponseWithRelation<string>>;
    checkUsernameAvailability(username: string): Promise<IResponseWithRelation<boolean>>;
    get(username: string): Promise<IResponseWithRelation<PublicUserDto>>;
}
