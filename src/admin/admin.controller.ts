import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { IDashboard } from './dto/dashboard-data.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // Add your admin controller methods here

    @Get('dashboard')
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    async getDashboardData() {
        const data: IDashboard = await this.adminService.getDashboardData();

        const response: IResponseWithRelation<IDashboard> = {
            statusCode: 200,
            message: 'Dashboard data retrieved successfully',
            data: data,
        }
        
        return response;
    }
}
