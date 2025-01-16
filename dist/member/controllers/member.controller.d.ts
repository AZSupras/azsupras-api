import { MemberService } from '../services/member.service';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { Member } from '../entities/member.entity';
import { MemberVehicle } from '../entities/member-vehicle.entity';
import { S3Service } from '@/s3/s3.service';
import { MemberDto } from '../dto/member.dto';
export declare class MemberController {
    private readonly memberService;
    private readonly s3Service;
    constructor(memberService: MemberService, s3Service: S3Service);
    findAll(): Promise<IResponseWithRelation<MemberDto[]>>;
    getAllVehicles(): Promise<IResponseWithRelation<MemberVehicle[]>>;
    getMemberVehicles(id: string): Promise<IResponseWithRelation<MemberVehicle[]>>;
    findOne(id: string): Promise<IResponseWithRelation<Member>>;
}
