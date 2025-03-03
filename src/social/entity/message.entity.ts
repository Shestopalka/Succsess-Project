import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MessageUser {
  @PrimaryGeneratedColumn()
  messageId: number;

  @ManyToOne(() => UsersProfile, (receiver) => receiver.receivedMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiverId' }) // Явна назва зовнішнього ключа
  receiver: UsersProfile;

  @ManyToOne(() => UsersProfile, (sender) => sender.sentMessages, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'senderId' }) // Явна назва зовнішнього ключа
  send: UsersProfile;

  @Column()
  content: string;

  @Column()
  isRead: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expire_at: Date; // Дата, коли запис стане "старим"

  @BeforeInsert()
  setExpirationDate() {
    const now = new Date();
    now.setDate(now.getDate() + 30); // Додаємо 30 днів
    this.expire_at = now;
  }
}
