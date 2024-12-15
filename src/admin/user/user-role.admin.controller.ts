import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IsAuthenticatedGuard } from '@/auth/guards/is-authenticated.guard';
import { IsAdminGuard } from '@/auth/guards/is-admin.guard';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { AdminUserService } from './user.admin.service';
import { User } from '@/user/entities/user.entity';
import { BanUserDto, UnbanUserDto } from '@/admin/dto/ban-user.dto';
import { AdminUserRoleService } from './user-role.admin.service';
import { UserRole } from '@/user/entities/user-role.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller(['admin/role', 'admin/roles'])
export class UserRoleAdminController {
    constructor(private readonly userRoleService: AdminUserRoleService) { }

    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @Get()
    async Admin_getAllUserRoles() {
        const results: UserRole[] = await this.userRoleService.findAll();

        const response: IResponseWithRelation<UserRole[]> = {
            statusCode: 200,
            message: 'Successfully fetched all user roles',
            count: results.length,
            data: results,
        };

        return response;
    }
}
