import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { MessageUser } from 'src/social/entity/message.entity';
import { User } from 'src/user/entities/user.entity';
import { VereficationEmail } from 'src/user/entities/verefication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(MessageUser)
    private readonly messageUserRepository: Repository<MessageUser>,
    @InjectRepository(VereficationEmail)
    private readonly verefycationEmailRepository: Repository<VereficationEmail>,
    @InjectRepository(User)
    private readonly userReposytory: Repository<User>,
  ) {}
  @Cron('0 0 1 */3 * *')
  private async DeleteReadMessages() {
    const existDate = await this.messageUserRepository.find({
      where: { isRead: true },
      select: ['messageId', 'created_at', 'expire_at'],
    });
    console.log(1);

    const idsData = existDate
      .filter((date) => date.created_at >= date.expire_at)
      .map((date) => date.messageId);

    if (idsData.length != 0) await this.messageUserRepository.delete(idsData);
  }

  @Cron('59 59 23 * * *')
  private async DeleteUnverifiedUsers() {
    const existUnverefaedUsers = await this.userReposytory.find({
      where: { isVerified: false },
      select: ['id'],
    });
    const existRequestUser = await this.verefycationEmailRepository.find({
      where: { isVerified: false },
      select: ['ReqId'],
    });
    const RequestUser = existRequestUser.map((req) => req.ReqId);
    const UnverefiedUsers = existUnverefaedUsers.map((user) => user.id);
    if (UnverefiedUsers.length != 0)
      await this.userReposytory.delete(UnverefiedUsers);
    if (RequestUser.length != 0)
      await this.verefycationEmailRepository.delete(RequestUser);
  }
}
