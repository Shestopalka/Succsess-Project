import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendUser } from 'src/friend-Subscription/entity/friendUser.entity';
import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import { Repository } from 'typeorm';
import { ProfileService } from 'src/profile/profile.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserService } from 'src/registrationUsers/user.service';
import { JwtService } from '@nestjs/jwt';
import { SubscribersUsers } from './entity/subscription.entity';
import { MessageUser } from 'src/social/entity/message.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(UsersProfile)
    private readonly userProfileRepository: Repository<UsersProfile>,
    @InjectRepository(FriendUser)
    private readonly userFriendRepository: Repository<FriendUser>,
    @InjectRepository(SubscribersUsers)
    private readonly subscribersUsersRepository: Repository<SubscribersUsers>,
    @InjectRepository(MessageUser)
    private readonly messageUserRepository: Repository<MessageUser>,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {}
  async addFriend(nickName: string, userId: number) {
    try {
      const sender = await this.userProfileRepository.findOne({
        where: { userId },
      });
      // Користувач, який отримує запит
      const receiver = await this.userProfileRepository.findOne({
        where: { nickName },
      });
      const existFriends = await this.userFriendRepository.findOne({
        where: [
          { user: receiver, friend: sender },
          { user: sender, friend: receiver },
        ],
      });
      if (existFriends) {
        // в разі існуюючої дружби між користувачами.
        throw new Error('You are already friends');
      }
      const removeSubscribe = await this.subscribersUsersRepository.findOne({
        where: [
          { subscriber: sender, user: receiver },
          { subscriber: receiver, user: sender },
        ],
      });
      // видаляємо запис підписки в таблиці підписок
      await this.subscribersUsersRepository.delete(
        removeSubscribe.subscriptionId,
      );
      // Перевірка, в випадку, якщо айді запитувача, рівне айді тому кому відправляється запит
      if (sender.userId == receiver.userId) {
        const profile = this.profileService.getProfile(sender);
        return profile;
      }

      // Перевірка чи існує користувача
      if (!receiver) throw new BadRequestException('User not found');

      // Check for an existing request in both directions
      const existingRequest = await this.messageUserRepository.findOne({
        where: [
          { send: receiver, receiver: sender },
          { send: sender, receiver: receiver },
        ],
        relations: ['receiver'],
      });

      if (existingRequest) {
        // Якщо, існує в буфері запит, повертати повідомлення про його існування.
        if (existingRequest.receiver.userId === sender.userId) {
          // If the receiver already sent a request, create a friendship
          await this.userFriendRepository.save({
            user: receiver,
            friend: sender,
          });

          const newMessage = await this.messageUserRepository.create({
            send: sender,
            receiver: receiver,
            content: `You have a new friend! ${sender.nickName}`,
            isRead: false,
          });
          await this.messageUserRepository.save(newMessage);
          return 'Friendship established!';
        }

        throw new BadRequestException('Request already sent');
      }

      // Create a new friend request

      const NewMessage = await this.messageUserRepository.create({
        send: sender,
        receiver: receiver,
        content: `Someone wants to add you as a friend!`,
        isRead: false,
      });

      await this.messageUserRepository.save(NewMessage);
      return 'Friend request sent';
    } catch (error) {
      return error.message;
    }
    // Користувач, котрий надсилає запит
  }
  async deliteFriends(nickName: string, user: any): Promise<string> {
    try {
      const userFriend = await this.userProfileRepository.findOne({
        where: {
          nickName: nickName,
        },
      });
      console.log(userFriend);
      console.log(user);

      if (!userFriend) throw new Error('The user is not your friend');
      const friendStatus = await this.userFriendRepository.findOne({
        where: {
          user: user,
        },
      });
      await this.userFriendRepository.delete(friendStatus.id);
      return 'The user has been unfriended';
    } catch (error) {
      return error.message;
    }
  }

  async subscription(nickName: string, userId: number): Promise<string> {
    try {
      const existNickName = await this.userProfileRepository.findOne({
        where: { nickName: nickName },
      });

      const user = await this.userProfileRepository.findOne({
        where: { userId: userId },
      });
      console.log(user, 'Service');

      if (!existNickName) throw new BadRequestException('NickName not found');

      if (existNickName.userId == user.userId)
        throw new BadRequestException('Fatal');

      const findsubscribe = await this.subscribersUsersRepository.findOne({
        where: { subscriber: user, user: existNickName },
        relations: ['subscriber', 'user'],
      });
      console.log(findsubscribe);

      if (findsubscribe)
        throw new BadRequestException(
          'You are already a follower of this user',
        );

      const findFriends = await this.userFriendRepository.findOne({
        where: [
          { friend: existNickName, user: user },
          { friend: user, user: existNickName },
        ],
      });

      if (findFriends) return 'You have this user as a friends';

      const reversSubscribe = await this.subscribersUsersRepository.findOne({
        where: { subscriber: existNickName, user: user },
        relations: ['subscriber', 'user'],
      });
      if (reversSubscribe) {
        return this.addFriend(nickName, userId);
      }

      const request = this.messageUserRepository.create({
        send: user,
        receiver: existNickName,
        content: `${user.nickName} Starting to follow you!`,
        isRead: false,
      });

      const subscribe = await this.subscribersUsersRepository.create({
        subscriber: user,
        user: existNickName,
      });
      await this.messageUserRepository.save(request);
      await this.subscribersUsersRepository.save(subscribe);
    } catch (error) {
      return error.message;
    }
  }
  async unsubscribeUser(nickName: string, user: any): Promise<void> {
    const existNickName = await this.userProfileRepository.findOne({
      where: { nickName: nickName },
    });
    if (!existNickName) throw new BadRequestException('NickName not found');

    const existUser = await this.userProfileRepository.findOne({
      where: { userId: user.userId },
    });

    console.log(existNickName);
    console.log(existUser);

    const existSubscribe = await this.subscribersUsersRepository.findOne({
      where: { subscriber: existUser, user: existNickName },
    });

    if (!existSubscribe)
      throw new BadRequestException('You are not following this user');
    await this.subscribersUsersRepository.delete(existSubscribe.subscriptionId);

    await this.messageUserRepository.save({
      receiver: user,
      content: `You are no longer following the user ${nickName}`,
      isRead: false,
    });
  }
  async FindUser(nickName: string): Promise<UsersProfile> {
    const user = await this.userProfileRepository.findOne({
      where: { nickName: nickName },
    });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }
}
