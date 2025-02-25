import { Subscriber } from '@/subscriber/subscriber.entity';
import { UserRole } from './user-role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash, compare, genSalt, } from 'bcryptjs';
import { Message } from '@/message/entities/message.entity';
import { Member } from '@/member/entities/member.entity';
import { UserBan } from './user-ban.entity';
import { UserPrivacySetting } from '@/member/types/UserPrivacySetting';

const defaultUserPrivacySetting: UserPrivacySetting = {
  firstNameVisible: true,
  lastNameVisible: false,
  middleNameVisible: false,
  suffixVisible: false,
  emailVisible: false,
  isPublic: true,
};

@Entity()
export class User {
  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    const results = await compare(plainPassword, this.password);

    return results;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false, })
  username: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true })
  firstName?: string

  @Column({ nullable: true })
  middleName?: string

  @Column({ nullable: true })
  lastName?: string

  @Column({ nullable: true })
  suffix?: string

  @Column({ unique: true, nullable: true, select: false })
  email?: string|null;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ nullable: true, select: false })
  bannedAt: Date;

  @Column({ nullable: true, select: false })
  bannedReason: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isOnline: boolean;
  
  @Column({ nullable: true})
  website?: string | null;

  @Column({ nullable: true})
  location?: string | null;

  @Column('jsonb', { default: defaultUserPrivacySetting })
  privacySettings: UserPrivacySetting;

  // emailVerified
  // This field is used to determine if the user has verified their email address.
  @Column({ default: false, select: false })
  emailVerified: boolean;

  // emailVerificationToken
  // This field is used to store the token that is sent to the user to verify their email address.
  @Column({ nullable: true, select: false })
  emailVerificationToken: string;

  // emailVerifiedAt
  // This field is used to store the date and time that the user verified their email address.
  @Column({ type: 'timestamp', nullable: true, select: false })
  emailVerifiedAt: Date;

  // passwordResetToken
  @Column({ nullable: true, select: false })
  passwordResetToken: string;

  // emailVerifiedAt
  // This field is used to store the date and time that the user verified their email address.
  @Column({ type: 'timestamp', nullable: true, select: false })
  passwordResetExpires: Date;

  // passwordResetRequestedAt
  @Column({ type: 'timestamp', nullable: true, select: false })
  passwordResetRequestedAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;

  // createdAt
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  // updatedAt
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt: Date;

  @Column({ nullable: true })
  inviteId?: string | null;

  // relations

  // one to one relationship with Subscriber
  @OneToOne(() => Subscriber)
  subscriber: Subscriber;

  @ManyToMany(() => UserRole, (role) => role.users)
  @JoinTable()
  roles: UserRole[];

  // user may have more than one ban
  @OneToMany(() => UserBan, (ban) => ban.user)
  bans: UserBan[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.recipient)
  receivedMessages: Message[];

  @OneToOne(() => Member, (member) => member.user)
  member?: Member|null;
}
