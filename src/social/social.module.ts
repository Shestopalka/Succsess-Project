import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import { MessageUser } from './entity/message.entity';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UsersProfile, MessageUser]),
    UserModule,
  ],
  controllers: [SocialController],
  providers: [SocialService],
})
export class SocialModule {}
