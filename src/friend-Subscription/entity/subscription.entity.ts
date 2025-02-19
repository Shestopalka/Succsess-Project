import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class SubscribersUsers {
  @PrimaryGeneratedColumn()
  subscriptionId: number;

  @ManyToOne(() => UsersProfile, (user) => user.subscriber)
  @JoinColumn({ name: 'userId' }) // Явне ім'я зовнішнього ключа
  user: UsersProfile;

  @ManyToOne(() => UsersProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriberId' }) // Явне ім'я зовнішнього ключа
  subscriber: UsersProfile;
}
