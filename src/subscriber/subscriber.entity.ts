import { Email } from 'src/email/email.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: false })
  subscribed: boolean;

  @Column({ nullable: true })
  unsubscribeToken: string;

  // unsubscribedAt
  @Column({ type: 'timestamp', nullable: true })
  unsubscribedAt: Date;

  // subscribeEmailSentAt
  @Column({ type: 'timestamp', nullable: true })
  subscribeEmailSentAt: Date;

  // unsubscribeEmailSentAt
  @Column({ type: 'timestamp', nullable: true })
  unsubscribeEmailSentAt: Date;

  // createdAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // updatedAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // deletedAt
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // one subscriber to many email relationship
  @OneToMany(() => Email, (email) => email.subscriber)
  emails: Email[];

  // optional one subscriber to one user relationship
  @OneToOne(() => User, (user) => user.subscriber, { nullable: true })
  user: User;
}
