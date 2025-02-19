import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { MessageUser } from 'src/social/entity/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(MessageUser)
    private readonly messageUserRepository: Repository<MessageUser>,
  ) {}
  @Cron('* * */1 * * *')
  async testMethod() {
    const existDate = await this.messageUserRepository.find({
      where: { isRead: true },
      select: ['messageId', 'created_at', 'expire_at'],
    });
    const idsData = existDate
      .filter((date) => date.created_at >= date.expire_at)
      .map((date) => date.messageId);

    if (idsData.length != 0) await this.messageUserRepository.delete(idsData);
  }
}
