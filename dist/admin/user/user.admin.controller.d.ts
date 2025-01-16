import { IResponseWithRelation } from '@/interfaces/IResponse';
import { AdminUserService } from './user.admin.service';
import { User } from '@/user/entities/user.entity';
import { BanUserDto, UnbanUserDto } from '@/admin/dto/ban-user.dto';
import { UserUpdate } from '@/user/dto/user-update.dto';
export declare class AdminUserController {
    private readonly userService;
    constructor(userService: AdminUserService);
    Admin_getAllUsers(): Promise<IResponseWithRelation<User[]>>;
    Admin_getOneUserByUsername(username: string): Promise<IResponseWithRelation<User>>;
    Admin_updateUser(username: string, updatesUser: UserUpdate): Promise<IResponseWithRelation<User>>;
    Admin_banUser(banUser: BanUserDto): Promise<IResponseWithRelation<User>>;
    Admin_unbanUser(banUser: UnbanUserDto): Promise<IResponseWithRelation<User>>;
    Admin_deleteUser(username: string): Promise<IResponseWithRelation<User>>;
}
