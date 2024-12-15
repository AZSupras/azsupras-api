import { BaseEntity as TypeOrmBaseEntity } from 'typeorm';
export declare class BaseEntity extends TypeOrmBaseEntity {
    createdAt: Date;
    updatedAt?: Date | null;
}
