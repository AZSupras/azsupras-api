import { MemberService } from '../services/member.service';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { IResponse, IResponseWithRelation } from '@/interfaces/IResponse';
import { Member } from '../entities/member.entity';
import { MemberVehicle } from '../entities/member-vehicle.entity';
import { S3Service } from '@/s3/s3.service';
import { MemberDto } from '../dto/member.dto';
import { User } from '@/user/entities/user.entity';
export declare class MemberController {
    private readonly memberService;
    private readonly s3Service;
    constructor(memberService: MemberService, s3Service: S3Service);
    findAll(): Promise<IResponseWithRelation<MemberDto[]>>;
    getMyMember(user: User): Promise<IResponse>;
    upsertMyMemberProfile(user: User, updatesUser: UpdateMemberDto): Promise<IResponseWithRelation<Member>>;
    getSingleMemberById(id: string): Promise<IResponseWithRelation<Member>>;
    getMemberVehicles(id: string): Promise<IResponseWithRelation<MemberVehicle[]>>;
}
