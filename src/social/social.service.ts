// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageUser } from './entity/message.entity';
import { UsersProfile } from 'src/profile/entity/userProfile.entity';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(MessageUser)
    private readonly messageUserRepository: Repository<MessageUser>,
    @InjectRepository(UsersProfile)
    private readonly userProfileRepository: Repository<UsersProfile>,
  ) {}

  async getMessage(user: any): Promise<object> {
    const userExist = await this.userProfileRepository.findOne({
      where: { userId: user.userId },
    });
    await this.messageUserRepository.update(
      { receiver: userExist },
      { isRead: true },
    );
    const listMessage = await this.messageUserRepository.find({
      where: { receiver: userExist },
      select: ['content', 'send'],
    });
    return listMessage;
  }
}
