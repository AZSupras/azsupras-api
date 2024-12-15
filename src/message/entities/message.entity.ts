import { User } from "@/user/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ unique: false })
  subject: string;

  @Column({ unique: false })
  content: string;

  @Column()
  senderId: string;

  @Column()
  recipientId: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
    default: null,
  })
  updatedAt?: Date | null;

  @OneToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;
}
