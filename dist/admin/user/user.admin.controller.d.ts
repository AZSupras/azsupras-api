import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { AdminUserService } from './user.admin.service';
import { User } from 'src/user/entities/user.entity';
import { BanUserDto, UnbanUserDto } from 'src/admin/dto/ban-user.dto';
export declare class AdminUserController {
    private readonly userService;
    constructor(userService: AdminUserService);
    Admin_getAll(): Promise<IResponseWithRelation<User[]>>;
    Admin_getOneByUsername(username: string): Promise<IResponseWithRelation<User>>;
    Admin_banUser(banUser: BanUserDto): Promise<IResponseWithRelation<User>>;
    Admin_unbanUser(banUser: UnbanUserDto): Promise<IResponseWithRelation<User>>;
}
