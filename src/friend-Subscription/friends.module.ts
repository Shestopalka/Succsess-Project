import { forwardRef, Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/registrationUsers/user.module';
import { ProfileModule } from 'src/profile/profile.module';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersProfile } from 'src/profile/entity/userProfile.entity';
import { FriendUser } from 'src/friend-Subscription/entity/friendUser.entity';
import { SubscribersUsers } from './entity/subscription.entity';
import { MessageUser } from 'src/social/entity/message.entity';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => ProfileModule),
    forwardRef(() => UserModule), // Додано forwardRef
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      FriendUser,
      UsersProfile,
      SubscribersUsers,
      MessageUser,
    ]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
