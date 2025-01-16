import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { IsAuthenticatedGuard } from '@/auth/guards/is-authenticated.guard';
import { IsAdminGuard } from '@/auth/guards/is-admin.guard';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { IDashboard } from './dto/dashboard-data.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

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
