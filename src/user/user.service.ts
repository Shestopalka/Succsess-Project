/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from 'passport';
import * as bcrypt from 'bcrypt';
import { UsersProfile } from '../profile/entity/userProfile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UsersProfile)
    private readonly usersProfileRepository: Repository<UsersProfile>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('This email already exist');

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const user = await this.userRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      surname: createUserDto.surname,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    console.log(user.id, 'TEST');

    // Створення профілю
    const profileUser = await this.usersProfileRepository.create({
      userId: user.id, // Встановлення зв'язку з користувачем
      nickName: createUserDto.nickName,
      name: createUserDto.name,
      surname: createUserDto.surname,
      email: createUserDto.email,
      password: hashedPassword,
    });

    await this.usersProfileRepository.save(profileUser);

    return savedUser;
  }
  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
