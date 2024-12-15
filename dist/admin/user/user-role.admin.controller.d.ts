import { IResponseWithRelation } from '@/interfaces/IResponse';
import { AdminUserRoleService } from './user-role.admin.service';
import { UserRole } from '@/user/entities/user-role.entity';
export declare class UserRoleAdminController {
    private readonly userRoleService;
    constructor(userRoleService: AdminUserRoleService);
    Admin_getAllUserRoles(): Promise<IResponseWithRelation<UserRole[]>>;
}
