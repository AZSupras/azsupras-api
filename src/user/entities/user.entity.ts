import { Invite } from 'src/invite/invite.entity';
import { Subscriber } from 'src/subscriber/subscriber.entity';
import { UserRole } from './user-role.entity';
import {
  BeforeInsert,
  BeforeUpdate,
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
import { Ban } from 'src/admin/ban/ban/ban.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true })
  firstName?: string|null;

  @Column({ nullable: true })
  lastName?: string|null;

  @Column({ unique: true, nullable: true, select: false })
  email?: string|null;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ nullable: true, select: false })
  bannedAt: Date;

  @Column({ nullable: true, select: false })
  bannedReason: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isOnline: boolean;

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

  // one to one relationship with Subscriber
  @OneToOne(() => Subscriber)
  subscriber: Subscriber;

  // one to one relationship with Invite
  @OneToOne(() => Invite, (invite) => invite.user)
  invite: Invite;

  @ManyToMany(() => UserRole, (role) => role.users)
  @JoinTable()
  roles: UserRole[];

  // user may have more than one ban
  @OneToMany(() => Ban, (ban) => ban.user)
  bans: Ban[];

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  @BeforeInsert()
  async hashPassowrd(): Promise<void> {
    const salt = await genSalt(10);

    if (!/^\$2[abxy]?\$\d+\$/.test(this.password)) {
      this.password = await hash(this.password, salt);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async checkIfVerified(): Promise<void> {
    if (this.emailVerified && this.firstName && this.lastName) {
      this.isVerified = true;
    }
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    const results = await compare(plainPassword, this.password);

    return results;
  }
}
