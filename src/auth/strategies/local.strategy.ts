import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const existingUser = await this.userService.findOne(email);

      if (!existingUser) {
        throw new BadRequestException(
          'Check that the password and email are entered correctly',
        );
      }
      if (!existingUser.isVerified)
        throw new UnauthorizedException(
          'You have not passed verification. Check your mail.',
        );
      const passwordIsMatch = await this.authService.comparePassword(
        password,
        existingUser,
      );
      if (!passwordIsMatch)
        throw new BadRequestException('The password is incorrect');

      const userWithoutPassword = { ...existingUser };
      delete userWithoutPassword.password;

      return userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
 }
}
