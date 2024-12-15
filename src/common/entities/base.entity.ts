import {
    BaseEntity as TypeOrmBaseEntity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity extends TypeOrmBaseEntity {
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
        nullable: true,
        default: null,
    })
    updatedAt?: Date | null;
}