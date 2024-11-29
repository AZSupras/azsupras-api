import { Controller, Get, Param, Query } from '@nestjs/common';
import { InviteService } from './invite.service';
import { count } from 'console';
import { Invite } from './invite.entity';
import { IResponseWithRelation } from 'src/interfaces/IResponse';

@Controller('invite')
export class InviteController {
    constructor(
        private readonly inviteService: InviteService,
    ) { }
    
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

    @Get('clearall')
    async clearAll() {
        await this.inviteService.clearAll();

        return {
            statusCode: 200,
            message: 'Success',
        };
    }

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
