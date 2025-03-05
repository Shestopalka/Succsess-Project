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
import { ProfileSetings } from 'src/profile/entity/profileSetings.entity';

import { InjectModel } from '@nestjs/mongoose';
import { DeleteUsers, DeleteUsersSchema } from './schema/user.schema';
import { Model } from 'mongoose';
import { create } from 'domain';

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
    @InjectRepository(ProfileSetings)
    private readonly profileSetingsRepository: Repository<ProfileSetings>,

    @InjectModel(DeleteUsers.name)
    private deleteUserModel: Model<DeleteUsers>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    }); // Пошук користувача за емайлом
    const existDellUser = await this.findDelletedAccount(createUserDto.email); // Шукаємо чи не був користувач зарегістрований раніше
    if (existDellUser) {
      const token = randomBytes(32).toString('hex'); // створюємо унікальний токен
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      ); // хешування паролю.
      const returnUsers = await this.userRepository.create({
        email: createUserDto.email,
        password: hashedPassword,
        userToken: token,
      }); // створюємо запис в таблиці користувачів
      await this.userRepository.save(returnUsers); 
      return this.mailService.messageReturnedUser(
        returnUsers.email,
        `http://localhost:4000/users/registrarion/returnUser${token}`,
      ); // надсилаємо користувачу повідомлення на пошту
    }
    const existNickName = await this.usersProfileRepository.findOne({
      where: { nickName: createUserDto.nickName },
    }); // Пошук користувача за Нікнеймом
    if (existNickName)
      throw new BadRequestException('This nickName alredy exist'); // Користувач з таким нікнеймом існує!

    if (existUser) throw new BadRequestException('This email already exist'); // Користувач з цим емайлом існує!

    const vereficationToker = randomBytes(32).toString('hex'); // генерація унікального токену.

    const randomNumber = Math.floor(100000 + Math.random() * 900000); // генерація унікального коду.

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    ); // хешування паролю.
    const user = await this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      isVerified: false,
      userToken: vereficationToker,
    }); // створення запису в таблиці Users

    await this.userRepository.save(user); // збереження користувача в таблиці.
    console.log('TEST');

    const VereficationRequestPass =
      await this.vereficationEmailRepository.create({
        userId: user.id,
        VerifyPass: String(randomNumber),
        isVerified: false,
      }); // створення запису в таблиці верефікації, для перевірки чи справді емаіл є данного користувача.
    await this.vereficationEmailRepository.save(VereficationRequestPass);

    const profile = await this.usersProfileRepository.create({
      userId: user.id,
      email: createUserDto.email,
      name: createUserDto.name,
      surname: createUserDto.surname,
      nickName: createUserDto.nickName,
    }); // створення запису в таблиці профілів.
    await this.usersProfileRepository.save(profile); // збереження в користувача в таблиці профілів.

    const setingsProfile = await this.profileSetingsRepository.create({
      id: profile.userId,
    }); // створення запису в таблиці параметрів профілю користувача.

    await this.profileSetingsRepository.save(setingsProfile); // збереження запису в таблиці параметрів.

    await this.mailService.vereficationEmail(
      createUserDto.email,
      createUserDto.nickName,
      randomNumber,
    ); // виклик методу в сервісі Маіл, надсилання повідомлення користувачу.

    return vereficationToker; // Повертаємо токен верефікації за для унікального маршуту.
  }
  async findDelletedAccount(email: string){ // Функція для перевірки чи не був користувач зарегістрований раніше.
    const existDelletedAccount = await this.deleteUserModel.findOne({
      email: email,
    });
    if (existDelletedAccount) return existDelletedAccount; // В разі знайденого запису, повертаємо документ користувача.

    return false;
  }

  async returnUsers(token: string) {
    const existUser = await this.userRepository.findOne({
      where: { userToken: token },
    });
    const existDellUser = await this.deleteUserModel.findOne({
      email: existUser.email,
    });
    const returnProfileUser = await this.usersProfileRepository.create({
      userId: existUser.id,
      nickName: existDellUser.nickName,
      name: existDellUser.name,
      surname: existDellUser.surName,
      email: existDellUser.email,
      avatar: existDellUser.avatar,
    });
    const profileSetings = await this.profileSetingsRepository.create({
      id: existUser.id,
      publicAccount: existDellUser.publicAccount,
    });
    await this.userRepository.update(
      { isVerified: existUser.isVerified, userToken: existUser.userToken },
      { isVerified: true, userToken: '' },
    );
    await this.profileSetingsRepository.save(profileSetings);
    await this.deleteUserModel.deleteOne({email: existDellUser.email});
    return await this.usersProfileRepository.save(returnProfileUser);
  }

  async VereficationUserPass(pass: string, token: string) {
    const existPass = await this.vereficationEmailRepository.findOne({
      where: {
        VerifyPass: pass,
      },
    }); // шукаємо запис в таблиці верефікації, по переданому унікальному верефікаційному коду.
    const existUser = await this.userRepository.findOne({
      where: { userToken: token },
    }); // шукаємо запис в таблиці Users по переданому унікальному верефікаційному токену.
    console.log(existPass);

    if (!existUser || existUser.id != existPass.userId)
      // перевірка на унікальність та правельність маршуту.
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );

    const existRequest = await this.vereficationEmailRepository.findOne({
      where: { userId: existUser.id },
    }); // Шукаємо запис в таблиці верефікації, по переданому айді користувача.

    if (!existPass) {
      if (existRequest.attempt > 3) {
        await this.vereficationEmailRepository.delete(existRequest.ReqId);
        throw new BadRequestException(
          'You have reached the limit of verification attempts. Try again',
        ); // повертаємо повідомлення про вичерпання кількосіт спроб верефікуватись.
      }
      await this.vereficationEmailRepository.update(
        { attempt: existRequest.attempt },
        { attempt: (existRequest.attempt += 1) },
      ); // якщо кіллкість не дорівнює 3, збільшуємо кількість спроб на 1.
      throw new BadRequestException('code is not valid'); // повертаємо повідомлення про не вірний код.
    }
    const profile = await this.usersProfileRepository.findOne({
      where: { userId: existUser.id },
    }); // шукаємо запис в таблиці профілів.

    await this.userRepository.update(
      { id: existUser.id, userToken: existUser.userToken },
      { isVerified: true, userToken: '' },
    ); // оновлюємо запис в таблиці Users , змінюєм чи Верефікований користувач на трю, видаляєм унікальний токен.
    await this.vereficationEmailRepository.delete(existPass.ReqId); // видаляємо запис в таблиці Верефікації.
    await this.messageUserRepository.save({
      content: `Congratulations ${profile.name} you made the right choice 😉`,
      isRead: false,
      receiver: profile,
    }); // відпрвляєм користувачу повідомлення в профіль про успішну регістрацію на проекті.
    return profile;
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async verefyResetToken(token: string): Promise<boolean> {
    const existUser = await this.userRepository.findOne({
      where: { userToken: token },
    });
    if (!existUser) return false;

    return true;
  }
}
