import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { InviteService } from './invite.service';
import { count } from 'console';
import { Invite } from './invite.entity';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { IsAuthenticatedGuard } from 'src/auth/guards/is-authenticated.guard';

@Controller('invite')
export class InviteController {
    constructor(
        private readonly inviteService: InviteService,
    ) { }
    
    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @Get('generate')
    async generate(@Query('count') count: number = 1) {
        const data = await this.inviteService.createMany(count);

        const response: IResponseWithRelation<Invite[]> = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };

        return response;
    }

    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @Get('clearall')
    async clearAll() {
        await this.inviteService.clearAll();

        return {
            statusCode: 200,
            message: 'Success',
        };
    }

    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @Get()
    async findAll() {
        const data = await this.inviteService.findAll();

        const response: IResponseWithRelation<Invite[]> = {
            statusCode: 200,
            message: 'Success',
            count: data.length,
            data,
        };

        return response;
    }

    @UseGuards(IsAuthenticatedGuard, IsAdminGuard)
    @Get(':code')
    async findOneByCode(@Param('code') code: string) {
        const data = await this.inviteService.findOneByCode(code);

        const response: IResponseWithRelation<Invite> = {
            statusCode: 200,
            message: 'Success',
            data,
        };

        return response;
    }
}
