import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: false })
  used: boolean;

  // createdAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // updatedAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // usedAt
  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  // inviteEmailSentAt
  @Column({ type: 'timestamp', nullable: true })
  inviteEmailSentAt: Date;

  // optional one invite to one user relationship
  @OneToOne(() => User, (user) => user.invite, { nullable: true })
  user: User;
}
