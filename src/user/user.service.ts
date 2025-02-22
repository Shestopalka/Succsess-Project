/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from 'passport';
import * as bcrypt from 'bcrypt';
import { UsersProfile } from '../profile/entity/userProfile.entity';
import { MailService } from 'src/mail/mail.service';
import { VereficationEmail } from './entities/verefication.entity';
import { randomBytes } from 'crypto';
import { MessageUser } from 'src/social/entity/message.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UsersProfile)
    private readonly usersProfileRepository: Repository<UsersProfile>,
    @InjectRepository(VereficationEmail)
    private readonly vereficationEmailRepository: Repository<VereficationEmail>,
    @InjectRepository(MessageUser)
    private readonly messageUserRepository: Repository<MessageUser>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    const existNickName = await this.usersProfileRepository.findOne({
      where: { nickName: createUserDto.nickName },
    });
    if (existNickName)
      throw new BadRequestException('This nickName alredy exist');
    if (existUser) throw new BadRequestException('This email already exist');

    const vereficationToker = randomBytes(32).toString('hex');

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const user = await this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      isVerified: false,
      userToken: vereficationToker,
    });

    await this.userRepository.save(user);
    console.log('TEST');

    const VereficationRequestPass =
      await this.vereficationEmailRepository.create({
        userId: user.id,
        VerifyPass: String(randomNumber),
        isVerified: false,
        email: createUserDto.email,
        name: createUserDto.name,
        nickName: createUserDto.nickName,
        surname: createUserDto.surname,
      });
    await this.vereficationEmailRepository.save(VereficationRequestPass);

    await this.mailService.VereficationUsers(
      createUserDto.email,
      createUserDto.nickName,
      randomNumber,
    );

    return vereficationToker;
  }
  async VereficationUserPass(pass: string, token: string) {
    const existPass = await this.vereficationEmailRepository.findOne({
      where: {
        VerifyPass: pass,
      },
    });

    const existUser = await this.userRepository.findOne({
      where: { userToken: token },
    });

    if (!existUser || existUser.id != existPass.userId)
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );

    const existRequest = await this.vereficationEmailRepository.findOne({
      where: { userId: existUser.id },
    });

    if (!existPass) {
      if (existRequest.attempt > 3) {
        await this.vereficationEmailRepository.delete(existRequest.ReqId);
        throw new BadRequestException(
          'You have reached the limit of verification attempts. Try again',
        );
      }
      await this.vereficationEmailRepository.update(
        { attempt: existRequest.attempt },
        { attempt: (existRequest.attempt += 1) },
      );
      throw new BadRequestException('code is not valid');
    }

    await this.userRepository.update(
      { id: existUser.id, userToken: existUser.userToken },
      { isVerified: true, userToken: '' },
    );
    const profile = await this.usersProfileRepository.create({
      userId: existPass.userId,
      email: existPass.email,
      name: existPass.name,
      surname: existPass.surname,
      nickName: existPass.nickName,
    });
    await this.usersProfileRepository.save(profile);
    await this.vereficationEmailRepository.delete(existPass.ReqId);
    await this.messageUserRepository.save({
      content: `Congratulations ${profile.name} you made the right choice 😉`,
      isRead: false,
      receiver: profile,
    });
    return profile;
  }
  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
// const profileUser = await this.usersProfileRepository.create({
//   userId: user.id, // Встановлення зв'язку з користувачем
//   nickName: createUserDto.nickName,
//   name: createUserDto.name,
//   surname: createUserDto.surname,
//   email: createUserDto.email,
//   password: hashedPassword,
// });

// await this.usersProfileRepository.save(profileUser);
