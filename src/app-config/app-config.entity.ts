import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class AppConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'App Name' })
  appName: string;

  @Column({ default: false })
  registrationEnabled: boolean;

  @Column({ default: false })
  emailVerificationRequired: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
