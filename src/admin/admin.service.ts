import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/logger/logger.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { IDashboard } from './dto/dashboard-data.dto';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AdminService {
    private readonly logger = new LoggerService(AdminService.name);
  
    constructor(
      private readonly userService: UserService,
    ) { }
  
    public async getDashboardData(): Promise<IDashboard> {
        const usersOnline   = await this.userService.getOnlineUserCount();
        const usersOffline  = await this.userService.getOfflineUserCount();
        const adminsOnline  = await this.userService.getOnlineAdminCount();
        const adminsOffline = await this.userService.getOfflineAdminCount();

        const users  = usersOnline + usersOffline;
        const admins = adminsOnline + adminsOffline;
        const total  = users + admins;
        const data: IDashboard = {
            users,
            admins,
            usersOnline: usersOnline,
            usersOffline: usersOffline,
            adminsOnline: adminsOnline,
            adminsOffline: adminsOffline,
            total,
        }

        return data;
    }
}
