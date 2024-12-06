import { IDashboard } from './dto/dashboard-data.dto';
import { UserService } from 'src/user/services/user.service';
export declare class AdminService {
    private readonly userService;
    private readonly logger;
    constructor(userService: UserService);
    getDashboardData(): Promise<IDashboard>;
}
