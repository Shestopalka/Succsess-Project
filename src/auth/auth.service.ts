import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendUser } from 'src/friend-Subscription/entity/friendUser.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userServise: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UsersProfile)
    private readonly userProfileRepository: Repository<UsersProfile>,
    @InjectRepository(FriendUser)
    private readonly userFriendRepository: Repository<FriendUser>,
  ) {}

  sayHello() {
    return 'Hello World!';
  }
  async login(user: any) {
    const payload = { sub: user.id, userEmail: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async createAdminRole(accessKey: string, user: any) {
    const key = process.env.ADMIN_KEY;
    console.log(typeof key);

    const key_admin = accessKey;
    console.log(typeof key_admin);

    if (key_admin != key) {
      throw new BadRequestException('The keys do not match');
    }
    return await { user: user, message: 'Access granted', role: 'admin' };
  }
}
