import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendUser } from 'src/friend-Subscription/entity/friendUser.entity';
import { ProfileSetings } from './entity/profileSetings.entity';
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UsersProfile)
    private readonly usersProfileRepository: Repository<UsersProfile>,
    @InjectRepository(FriendUser)
    private readonly userFriendRepository: Repository<FriendUser>,
    @InjectRepository(ProfileSetings)
    private readonly userSetingsProfule: Repository<ProfileSetings>,
  ) {}
  private readonly logger = new Logger(ProfileService.name);
  async getProfile(user: any): Promise<UsersProfile> {
    this.logger.warn('This GETPROFILE...');
    const profile = await this.usersProfileRepository.findOne({
      where: { userId: user },
    });
    const ProfilseStatus = await this.userSetingsProfule.findOne({
      where: { id: user },
    });
    if (ProfilseStatus.publicAccount == false) {
      const message = {
        mess: 'This is a private account, subscribe and gain access to view it',
        user: profile.nickName,
      };
      throw new BadRequestException(message);
    }

    return profile;
  }
  async addBio(bio: string, userId: number): Promise<string> {
    const profile = await this.usersProfileRepository.findOne({
      where: { userId },
    });

    profile.biography = bio;
    await this.usersProfileRepository.save(profile);
    return 'Bio add for you profile!';
  }

  async addAvatar(url: any, user: any) {
    try {
      const existUser = await this.usersProfileRepository.findOne({
        where: { userId: user },
      });

      if (!existUser) throw new UnauthorizedException();

      existUser.avatar = url;
      await this.usersProfileRepository.save(existUser);

      return 'Avatar successfully added';
    } catch (error) {
      return error.message;
    }
  }

  async friendList(user: any) {
    const friends = await this.userFriendRepository.find({
      where: [
        { user: user.userId }, // Шукаємо, де userId в полі `user`
        { friend: user.userId }, // Шукаємо, де userId в полі `friend`
      ],
      relations: ['user', 'friend'], // Завантажуємо пов'язані об'єкти
    });
    const getListFriends = await friends.map((relation) =>
      relation.user.userId != user.userId ||
      relation.friend.userId != user.userId
        ? relation.friend
        : relation.user,
    ); // перевірка, в якій колонці знаходиться айді друга, якого ми хочемо вернути.
    return getListFriends;
  }
}
