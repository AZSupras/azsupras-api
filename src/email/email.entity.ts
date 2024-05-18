import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISentMessageInfo } from './email.service';

@Entity()
export class Email {
  // id string uuid
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column()
  template: string;

  @Column()
  subject: string;

  @Column({ type: 'json' })
  context: string;

  @Column({ type: 'json', nullable: true })
  response: ISentMessageInfo;

  @Column({ default: false })
  sent: boolean;

  @Column({ default: false })
  sending: boolean;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  error: string;

  @Column({ nullable: true })
  errorAt: Date;

  @Column({ nullable: true })
  errorStack: string;

  @Column({ nullable: true })
  errorData: string;

  // createdAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // updatedAt
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // deletedAt
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
