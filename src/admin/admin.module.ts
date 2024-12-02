import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserModule } from 'src/user/user.module';
import { BanModule } from './ban/ban/ban.module';

@Module({
  imports: [
    UserModule,
    BanModule,
  ],
  providers: [AdminService,],
  exports: [AdminService,],
})
export class AdminModule {}
