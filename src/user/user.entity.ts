import { Invite } from 'src/invite/invite.entity';
import { Subscriber } from 'src/subscriber/subscriber.entity';
import { UserRole } from 'src/user-role/user-role.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true, select: false })
  firstName: string;

  @Column({ nullable: true, select: false })
  lastName: string;

  @Column({ unique: true, nullable: true, select: false })
  email: string;

  @Column({ default: true })
  isPublic: boolean;

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

  // createdAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  // updatedAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  // one to one relationship with Subscriber
  @OneToOne(() => Subscriber)
  subscriber: Subscriber;

  // one to one relationship with Invite
  @OneToOne(() => Invite, (invite) => invite.user)
  invite: Invite;

  @ManyToMany(() => UserRole, role => role.users)
  @JoinTable()
  roles: UserRole[];
}
