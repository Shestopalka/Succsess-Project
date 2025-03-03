import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../registrationUsers/entities/user.entity';
import { FriendUser } from '../../friend-Subscription/entity/friendUser.entity';
import { SubscribersUsers } from 'src/friend-Subscription/entity/subscription.entity';
import { MessageUser } from 'src/social/entity/message.entity';

@Entity()
export class UsersProfile {
  @PrimaryColumn()
  userId: number;

  @Column({ unique: true })
  nickName: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  biography: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => MessageUser, (message) => message.receiver, {
    cascade: true,
  })
  receivedMessages: MessageUser[]; // Змінено ім'я для коректного зв’язку

  @OneToMany(() => MessageUser, (message) => message.send, { cascade: true })
  sentMessages: MessageUser[]; // Змінено ім'я для коректного зв’язку

  @OneToMany(() => SubscribersUsers, (subscriber) => subscriber.user, {
    cascade: true,
  })
  subscriber: SubscribersUsers[];

  @OneToMany(() => FriendUser, (friend) => friend.user, { cascade: true })
  friends: FriendUser[];

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // Вказуємо, що це зовнішній ключ
  user: User;
}
