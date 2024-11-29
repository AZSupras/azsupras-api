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

  @Column({ default: false })
  passwordResetEnabled: boolean;

  @Column({ default: false })
  emailLoginEnabled: boolean;

  @Column({ default: 8 })
  passwordMinLength: number;

  @Column({ default: false })
  passwordAlphRequired: boolean;

  @Column({ default: false })
  passwordNumRequired: boolean;

  @Column({ default: false })
  passwordSpecialCharRequired: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
