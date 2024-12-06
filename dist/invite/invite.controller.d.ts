import { InviteService } from './invite.service';
import { Invite } from './invite.entity';
import { IResponseWithRelation } from 'src/interfaces/IResponse';
export declare class InviteController {
    private readonly inviteService;
    constructor(inviteService: InviteService);
    generate(count?: number): Promise<IResponseWithRelation<Invite[]>>;
    clearAll(): Promise<{
        statusCode: number;
        message: string;
    }>;
    findAll(): Promise<IResponseWithRelation<Invite[]>>;
    findOneByCode(code: string): Promise<IResponseWithRelation<Invite>>;
}
