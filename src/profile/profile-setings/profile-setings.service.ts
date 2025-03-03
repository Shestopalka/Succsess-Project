import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ProfileSetings } from '../entity/profileSetings.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersProfile } from '../entity/userProfile.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/registrationUsers/entities/user.entity';
import { VereficationEmail } from 'src/registrationUsers/entities/verefication.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ChangePassword } from 'src/registrationUsers/entities/changePassword.entity';
import { TokenExpiredError } from '@nestjs/jwt';
@Injectable()
export class ProfileSetingsService {
  constructor(
    @InjectRepository(ProfileSetings)
    private readonly profileSetingsRepository: Repository<ProfileSetings>,
    @InjectRepository(UsersProfile)
    private readonly userProfileRepository: Repository<UsersProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VereficationEmail)
    private readonly vereficationEmailRepository: Repository<VereficationEmail>,
    @InjectRepository(ChangePassword)
    private readonly changePasswordRepository: Repository<ChangePassword>,
    private readonly mailService: MailService,
  ) {}
  async StatusAccount(userId: number) {
    console.log(userId, 'TEST');

    const existUserSetings = await this.profileSetingsRepository.findOne({
      where: { id: userId },
    });

    if (existUserSetings.publicAccount == false) {
      await this.profileSetingsRepository.update(
        { publicAccount: existUserSetings.publicAccount },
        { publicAccount: true },
      );
    } else {
      await this.profileSetingsRepository.update(
        { publicAccount: existUserSetings.publicAccount },
        { publicAccount: false },
      );
    }
  }

  async vereficationForChangePassword(user: any, password: string) {
    const existUser = await this.userRepository.findOne({
      where: { id: user.userId },
    });
    const existChange = await this.changePasswordRepository.findOne({
      where: { id: existUser.id },
    });
    console.log(existChange);
    
    if (existChange) throw new BadRequestException('Try a little later');
    
    const comparePassword = await bcrypt.compare(password, existUser.password);

    if (comparePassword)
      throw new BadRequestException('Come up with a new password!');
    const token = await crypto.randomBytes(32).toString('hex');
    await this.userRepository.update(
      { userToken: existUser.userToken },
      { userToken: token },
    );

    const hashPassword = await bcrypt.hash(password, 10);
    await this.changePasswordRepository.save({
      userId: existUser,
      changePassword: hashPassword,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const vereficationURL = `http://localhost:4000/profile-settings/changePassword/verify?token=${token}`;
    await this.mailService.vereficationUsersEmail(
      existUser.email,
      vereficationURL,
    );
  }
  async confirmResetPassword(token: string){
    const existUser = await this.userRepository.findOne({
      where: { userToken: token },
    });
    console.log(existUser);

    const existChangePassword = await this.changePasswordRepository.findOne({
      where: { id: existUser.id },
    });
    console.log(existChangePassword);
    await this.userRepository.update(
      { password: existUser.password },
      { password: existChangePassword.changePassword },
    );

    await this.changePasswordRepository.delete(existUser.id);
  }

  async vereficationForDeleteUserAccount(user: User): Promise<void> {
    const existUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    const verifyToken = await crypto.randomBytes(32).toString('hex');
    const vereficationURL = `http://localhost:4000/profile-settings/deleteAccount/verify?token=${verifyToken}`;
    await this.userRepository.update(
      { userToken: existUser.userToken },
      { userToken: verifyToken },
    );
    await this.mailService.vereficationUsersEmail(
      existUser.email,
      vereficationURL,
    );
  }

  async confrimDeleteAccount(token: string) {
    const existUser = await this.userRepository.findOne({
      where: { userToken: token },
    });
    const existProfile = await this.userProfileRepository.findOne({
      where: { userId: existUser.id },
    });
    await this.userRepository.remove(existUser);
    await this.mailService.accountDeletionMessage(
      existProfile.email,
      existProfile.name,
    );
  }
}
