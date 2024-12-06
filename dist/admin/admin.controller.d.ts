import { AdminService } from './admin.service';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { IDashboard } from './dto/dashboard-data.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardData(): Promise<IResponseWithRelation<IDashboard>>;
}
