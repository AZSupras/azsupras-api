import { Invite } from 'src/invite/invite.entity';
import { Subscriber } from 'src/subscriber/subscriber.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  // emailVerified
  // This field is used to determine if the user has verified their email address.
  @Column({ default: false })
  emailVerified: boolean;

  // emailVerificationToken
  // This field is used to store the token that is sent to the user to verify their email address.
  @Column({ nullable: true })
  emailVerificationToken: string;

  // emailVerifiedAt
  // This field is used to store the date and time that the user verified their email address.
  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  // passwordResetToken
  @Column({ nullable: true })
  passwordResetToken: string;

  // passwordResetRequestedAt
  @Column({ type: 'timestamp', nullable: true })
  passwordResetRequestedAt: Date;

  // createdAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // updatedAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // one to one relationship with Subscriber
  @OneToOne(() => Subscriber)
  subscriber: Subscriber;

  // one to one relationship with Invite
  @OneToOne(() => Invite, (invite) => invite.user)
  invite: Invite;
}
