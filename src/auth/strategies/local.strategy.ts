import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const existingUser = await this.userService.findOne(email);

    if (!existingUser) {
      throw new BadRequestException(
        'Check that the password and email are entered correctly',
      );
    }

    const passwordIsMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!passwordIsMatch) {
      throw new BadRequestException('The password is incorrect');
    }

    const userWithoutPassword = { ...existingUser };
    delete userWithoutPassword.password;

    return userWithoutPassword;
  }
}
