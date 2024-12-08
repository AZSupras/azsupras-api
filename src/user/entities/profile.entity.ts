import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true})
  website?: string | null;

  @Column({ nullable: true})
  location?: string | null;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;
}
