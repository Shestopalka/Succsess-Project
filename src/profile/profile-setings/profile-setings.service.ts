import { Injectable } from '@nestjs/common';
import { ProfileSetings } from '../entity/profileSetings.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileSetingsService {
  constructor(
    @InjectRepository(ProfileSetings)
    private readonly profileSetingsRepository: Repository<ProfileSetings>,
  ) {}
  async StatusAccount(userId: number) {
    console.log(userId, 'TEST');

    const existUserSetings = await this.profileSetingsRepository.findOne({
      where: { id: userId },
    });

    if (existUserSetings.publicAccount == false) {
      await this.profileSetingsRepository.update(
        {
          publicAccount: existUserSetings.publicAccount,
        },
        { publicAccount: true },
      );
    } else {
      await this.profileSetingsRepository.update(
        {
          publicAccount: existUserSetings.publicAccount,
        },
        { publicAccount: false },
      );
    }
  }
}
