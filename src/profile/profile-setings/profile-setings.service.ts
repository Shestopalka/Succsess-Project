import { BadGatewayException, Injectable } from '@nestjs/common';
import { ProfileSetings } from '../entity/profileSetings.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersProfile } from '../entity/userProfile.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class ProfileSetingsService {
  constructor(
    @InjectRepository(ProfileSetings)
    private readonly profileSetingsRepository: Repository<ProfileSetings>,
    @InjectRepository(UsersProfile)
    private readonly userProfileRepository: Repository<UsersProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService
  ) {}
  async StatusAccount(userId: number) {
    console.log(userId, 'TEST');

    const existUserSetings = await this.profileSetingsRepository.findOne({ where: { id: userId }, });

    if (existUserSetings.publicAccount == false) {
      await this.profileSetingsRepository.update(
        {publicAccount: existUserSetings.publicAccount},
        { publicAccount: true },
      );
    } else {
      await this.profileSetingsRepository.update(
        { publicAccount: existUserSetings.publicAccount },
        { publicAccount: false },
      );
    }
  }

  async vereficationUserforResetPassword(user: any, vereficationURL: string){
    const receiver = await this.userProfileRepository.findOne({
      where: { userId: user.userId },
    })
    await this.mailService.VereficationResetPassword( receiver.email, receiver.name, vereficationURL, );
  }

  async resestUserPassword(password: string, user: UsersProfile){
    const existUser = await this.userRepository.findOne({
      where: { id: user.userId },
    });
    const comparePassword = await bcrypt.compare(password, existUser.password)
    if (comparePassword)
      throw new BadGatewayException('Come up with a new password!');

    await this.userRepository.update(
      { password: existUser.password },
      { password: password },
    )
  }
}
