import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserModule } from '@/user/user.module';
import { AdminController } from './admin.controller';
import { AdminUserController } from './user/user.admin.controller';
import { AdminUserService } from './user/user.admin.service';
import { UserRoleAdminController } from './user/user-role.admin.controller';
import { AdminUserRoleService } from './user/user-role.admin.service';
import { AdminMemberModule } from './member/member.admin.module';
import { UserBanModule } from './user/user-ban.module';

@Module({
  imports: [
    UserModule,
    UserBanModule,
    AdminMemberModule,
  ],
  providers: [AdminService, AdminUserService, AdminUserRoleService],
  controllers: [
    AdminController,
    AdminUserController,
    UserRoleAdminController,
  ],
  exports: [AdminService, AdminUserService, AdminUserRoleService,],
})
export class AdminModule {}
