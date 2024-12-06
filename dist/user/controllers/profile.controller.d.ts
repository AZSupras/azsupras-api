import { UserUpdate } from '../dto/user-update.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { PublicUserDto } from '../dto/public-user.dto';
export declare class ProfileController {
    private readonly userService;
    constructor(userService: UserService);
    updateMe(user: User, updatesUser: UserUpdate): Promise<IResponseWithRelation<User>>;
    generateRandomUsername(): Promise<IResponseWithRelation<string>>;
    checkUsernameAvailability(username: string): Promise<IResponseWithRelation<boolean>>;
    get(username: string): Promise<IResponseWithRelation<PublicUserDto>>;
    getMe(user: User, req: Request): Promise<IResponseWithRelation<User>>;
    updateUser(username: string, updatesUser: UserUpdate): Promise<IResponseWithRelation<User>>;
}
