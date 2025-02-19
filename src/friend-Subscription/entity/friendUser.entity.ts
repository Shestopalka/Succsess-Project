import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersProfile } from '../../profile/entity/userProfile.entity';
@Entity()
export class FriendUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersProfile, (user) => user.friends, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UsersProfile;

  @ManyToOne(() => UsersProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'friend_id' })
  friend: UsersProfile;
}
