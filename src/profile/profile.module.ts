import { forwardRef, Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from 'src/auth/auth.module';
import { FriendsModule } from 'src/friend-Subscription/friends.module';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import { FriendUser } from 'src/friend-Subscription/entity/friendUser.entity';

import { S3Service } from 'src/s3/s3.service';
import { MessageUser } from 'src/social/entity/message.entity';
import { ProfileSetingsModule } from './profile-setings/profile-setings.module';
import { ProfileSetings } from './entity/profileSetings.entity';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => FriendsModule),
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      FriendUser,
      UsersProfile,
      MessageUser,
      ProfileSetings,
    ]),
    ProfileSetingsModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, S3Service],
  exports: [ProfileService, TypeOrmModule], // Додано TypeOrmModule
})
export class ProfileModule {}
