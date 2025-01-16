import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Member } from "./member.entity";

@Entity()
export class MemberPhoto {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    memberId: string

    @Column()
    url: string

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

    @OneToOne(() => Member, (member) => member.photo)
    @JoinColumn({ name: 'memberId' })
    member: Member;
}