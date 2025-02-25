import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { LoggerService } from '@/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { MemberPhoto } from '../entities/member-photo.entity';
import { CreateMemberPhotoDto } from '../dto/create-member-photo.dto';
import { MemberVehicle } from '../entities/member-vehicle.entity';
import { CreateMemberVehicleDto } from '../dto/create-member-vehicle.dto';
import { UpdateMemberVehicleDto } from '../dto/update-member-vehicle.dto';

@Injectable()
export class MemberService {
  private readonly logger = new LoggerService(MemberService.name);

  constructor(
    @InjectRepository(Member)
    private repo: Repository<Member>,
    @InjectRepository(MemberPhoto)
    private photoRepo: Repository<MemberPhoto>,
    @InjectRepository(MemberVehicle)
    private vehicleRepo: Repository<MemberVehicle>,
  ) { }

  public async find(query: FindManyOptions<Member>): Promise<Member[]> {
    const results = await this.repo.find(query);

    return results;
  }

  public async findAll(): Promise<Member[]> {
    const query: FindManyOptions<Member> = {
      relations: ['photo'],
    };
    const results = await this.repo.find(query);

    return results;
  }

  public async findOne(query: FindOneOptions<Member>): Promise<Member> {
    const results = await this.repo.findOne(query);

    return results;
  }

  public async findOneById(id: string): Promise<Member> {
    const results = await this.repo.findOne({ where: { id }, relations: ['photo'], });

    return results;
  }

  public async create(data: CreateMemberDto): Promise<Member> {
    const member = this.repo.create(data);
    const results = await this.repo.save(member);

    return results;
  }

  public async update(id: string, data: UpdateMemberDto): Promise<Member> {
    const member = await this.repo.findOne({ where: { id } });
    const results = await this.repo.save({ ...member, ...data });

    return results;
  }

  public async upsert(data: UpdateMemberDto): Promise<Member> {
    let results: Member;

    if (data.id) {
      results = await this.findOneById(data.id);
    }

    if (!results) {
      results = await this.create(data as CreateMemberDto);
    } else {
      results = await this.update(data.id, data);
    }


    return results;
  }

  public async remove(id: string): Promise<Member> {
    const member = await this.repo.findOne({ where: { id } });
    const results = await this.repo.remove(member);

    return results;
  }

  // Member Photo
  public async createPhoto(data: CreateMemberPhotoDto): Promise<MemberPhoto> {
    let photo = this.photoRepo.create(data);
    let member = await this.repo.findOne({ where: { id: data.memberId }, relations: ['photo'] });
    
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    photo.member = member;

    photo = await this.photoRepo.save(photo, {
      reload: true,
    });

    return photo;
  }

  public async getMemberPhoto(memberId: string): Promise<MemberPhoto> {
    const photo = await this.photoRepo.findOne({ where: { member: { id: memberId } } });

    return photo;
  }

  public async uploadPhoto(memberId: string, file: Express.Multer.File): Promise<MemberPhoto> {
    const photo = new MemberPhoto();
    photo.url = process.env.NODE_ENV === 'production' ? file.location : `/uploads/members/${memberId}/${file.filename}`;
    photo.memberId = memberId;
    return await this.photoRepo.save(photo);
  }

  public async removePhoto(id: string): Promise<MemberPhoto> {
    const photo = await this.photoRepo.findOne({ where: { id } });
    const results = await this.photoRepo.remove(photo);

    return results;
  }

  public async removeMemberPhoto(memberId: string): Promise<MemberPhoto> {
    const photo = await this.photoRepo.findOne({ where: { member: { id: memberId } } });
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const results = await this.photoRepo.remove(photo);

    return results;
  }

  public async findAllMemberPhoto(memberId: string): Promise<MemberPhoto[]> {
    const results = await this.photoRepo.find({ where: { memberId } });

    return results;
  }

  public async findOneMemberPhotoById(id: string): Promise<MemberPhoto> {
    const results = await this.photoRepo.findOne({ where: { id } });

    return results;
  }

  public async getMemberVehicles(memberId: string): Promise<MemberVehicle[]> {
    const results = await this.vehicleRepo.find({ where: { member: { id: memberId } }, });

    return results;
  }

  public async getAllVehicles(): Promise<MemberVehicle[]> {
    const results = await this.vehicleRepo.find();

    return results;
  }

  public async getVehicleById(id: string): Promise<MemberVehicle> {
    const results = await this.vehicleRepo.findOne({ where: { id }, });

    return results;
  }

  public async createVehicle(data: CreateMemberVehicleDto): Promise<MemberVehicle|MemberVehicle[]> {
    const vehicle = this.vehicleRepo.create(data);
    const results = await this.vehicleRepo.save(vehicle);

    return results;
  }

  public async updateVehicle(id: string, data: UpdateMemberVehicleDto): Promise<MemberVehicle> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id } });
    const results = await this.vehicleRepo.save({ ...vehicle, ...data });

    return results;
  }

  public async removeVehicle(id: string): Promise<MemberVehicle> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id } });
    const results = await this.vehicleRepo.remove(vehicle);

    return results;
  }
}
