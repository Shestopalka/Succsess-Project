import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/registrationUsers/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from './constants';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/registrationUsers/entities/user.entity';
import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import { FriendUser } from 'src/friend-Subscription/entity/friendUser.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([User, UsersProfile, FriendUser]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
