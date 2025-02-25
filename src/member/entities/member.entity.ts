import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { MemberPhoto } from "./member-photo.entity"
import { MemberVehicle } from "./member-vehicle.entity"
import { User } from "@/user/entities/user.entity"

const defaultUserPrivacySetting = {
    firstNameVisible: true,
    lastNameVisible: false,
    middleNameVisible: false,
    suffixVisible: false,
    emailVisible: false,
};

@Entity()
export class Member {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    firstName: string

    @Column({ nullable: true })
    middleName?: string

    @Column({ nullable: true })
    lastName?: string

    @Column({ nullable: true })
    suffix?: string

    @Column({ nullable: true })
    email?: string

    @Column({ nullable: true })
    phone?: string

    @Column({ nullable: true })
    address1?: string

    @Column({ nullable: true })
    address2?: string

    @Column({ nullable: true })
    city?: string

    @Column({ nullable: true })
    state?: string

    @Column({ nullable: true })
    zip?: string

    @Column({ nullable: true })
    country?: string

    @Column({ nullable: true })
    gender?: string

    @Column({ nullable: true })
    birthDate?: Date

    @Column({ nullable: true })
    userId?: string

    @Column('jsonb', { default: defaultUserPrivacySetting })
    privacySettings: object[];

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

    // Member can have one photo
    @OneToOne(() => MemberPhoto, (photo) => photo.member, { nullable: true, eager: true })
    photo?: MemberPhoto;

    // Member can own one vehicle
    @OneToMany(() => MemberVehicle, (vehicle) => vehicle.member, { eager: true })
    vehicles: MemberVehicle[];

    // Member can belong to one user
    @OneToOne(() => User, (user) => user.member)
    @JoinColumn()
    user?: User;
}