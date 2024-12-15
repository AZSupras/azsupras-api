import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@/logger/logger.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
    private readonly logger = new LoggerService(MessageService.name);
  
    constructor(
      @InjectRepository(Message)
      private repo: Repository<Message>,
    ) { }
    // public async findOne
    public async findOne(query: FindOneOptions<Message>): Promise<Message> {
        const result = await this.repo.findOne(query);
        
        return result;
    }

    // public async findMany
    public async findMany(query?: FindManyOptions<Message>): Promise<Message[]> {
        const result = await this.repo.find(query);
        
        return result;
    }

    // public async create
    public async create(data: CreateMessageDto): Promise<Message> {
        let result = this.repo.create(data);
        await this.repo.save(result);
        
        return result;
    }

    // public async update
    public async update(id: string, data: Partial<Message>): Promise<Message> {
        const result = await this.repo.save({ id, ...data });
        
        return result;
    }
    
    // public async toggleIsRead
    public async toggleIsRead(id: string): Promise<Message> {
        const message = await this.repo.findOne({
            where: {
                id
            }
        });

        if (!message) {
            throw new Error('Message not found');
        }

        message.isRead = !message.isRead;
        const result = await this.repo.save(message);
        
        return result;
    }

    // public async remove
    public async remove(id: string): Promise<Message> {
        const message = await this.repo.findOne({
            where: {
                id
            }
        });

        if (!message) {
            throw new Error('Message not found');
        }

        const result = await this.repo.remove(message);
        
        return result;
    }
}
