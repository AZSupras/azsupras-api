import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";

@Entity()
export class MemberVehicle {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    make: string

    @Column()
    model: string

    @Column()
    year: number

    @Column()
    vin?: string

    @Column({ nullable: true })
    color?: string

    // vehicle can be owned by one member
    @ManyToOne(() => Member, (member) => member.vehicles)
    member: Member;
}