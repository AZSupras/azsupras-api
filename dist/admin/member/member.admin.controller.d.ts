import { CreateMemberDto } from '@/member/dto/create-member.dto';
import { UpdateMemberDto } from '@/member/dto/update-member.dto';
import { IResponseWithRelation } from '@/interfaces/IResponse';
import { Member } from '@/member/entities/member.entity';
import { MemberPhoto } from '@/member/entities/member-photo.entity';
import { MemberVehicle } from '@/member/entities/member-vehicle.entity';
import { S3Service } from '@/s3/s3.service';
import { AdminMemberService } from './member.admin.service';
export declare class AdminMemberController {
    private readonly memberService;
    private readonly s3Service;
    constructor(memberService: AdminMemberService, s3Service: S3Service);
    findAll(): Promise<IResponseWithRelation<Member[]>>;
    create(createMemberDto: CreateMemberDto): Promise<IResponseWithRelation<Member>>;
    update(id: string, updateMemberDto: UpdateMemberDto): Promise<IResponseWithRelation<Member>>;
    getAllVehicles(): Promise<IResponseWithRelation<MemberVehicle[]>>;
    getMemberVehicles(id: string): Promise<IResponseWithRelation<MemberVehicle[]>>;
    remove(id: string): Promise<IResponseWithRelation<Member>>;
    addPhoto(id: string, file: Express.Multer.File): Promise<IResponseWithRelation<MemberPhoto>>;
    findOne(id: string): Promise<IResponseWithRelation<Member>>;
}
