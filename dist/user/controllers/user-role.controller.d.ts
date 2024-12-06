import { UserService } from '../services/user.service';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { User } from '../entities/user.entity';
import { UserRoleService } from '../services/user-role.service';
import { UserRole } from '../entities/user-role.entity';
export declare class UserRoleController {
    private readonly userService;
    private readonly userRoleService;
    constructor(userService: UserService, userRoleService: UserRoleService);
    getAll(user: User): Promise<IResponseWithRelation<UserRole[]>>;
    getOneBySlug(slug: string): Promise<IResponseWithRelation<UserRole>>;
    getOneById(id: number): Promise<IResponseWithRelation<UserRole>>;
}
