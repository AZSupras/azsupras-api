import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ban {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;
    
    @Column()
    reason: string;

    @Column({ nullable: true })
    expiresAt: Date | null;

    @Column({ default: false })
    isPermanent: boolean;

    @Column({ default: false })
    isActive: boolean;

    // relation banned by to User
    @OneToOne(type => User)
    @JoinColumn()
    bannedBy: User;

    // relation banned user to User
    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    // createdAt
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        select: false,
    })
    createdAt: Date;
}