import { forwardRef, Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from 'src/auth/auth.module';
import { FriendsModule } from 'src/friend-Subscription/friends.module';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import { FriendUser } from 'src/friend-Subscription/entity/friendUser.entity';
import { RegistrationModule } from 'src/registration/registration.module';
import { S3Service } from 'src/s3/s3.service';
import { MessageUser } from 'src/social/entity/message.entity';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => FriendsModule),
    forwardRef(() => RegistrationModule), // Додано forwardRef
    JwtModule.register({}),
    TypeOrmModule.forFeature([FriendUser, UsersProfile, MessageUser]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, S3Service],
  exports: [ProfileService, TypeOrmModule], // Додано TypeOrmModule
})
export class ProfileModule {}
