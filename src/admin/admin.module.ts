import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserModule } from 'src/user/user.module';
import { BanModule } from './ban/ban/ban.module';
import { AdminController } from './admin.controller';
import { AdminUserController } from './user/user.admin.controller';
import { AdminUserService } from './user/user.admin.service';

@Module({
  imports: [
    UserModule,
    BanModule,
  ],
  providers: [AdminService, AdminUserService,],
  controllers: [
    AdminController,
    AdminUserController,
  ],
  exports: [AdminService, AdminUserService,],
})
export class AdminModule {}
