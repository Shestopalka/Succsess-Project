import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersProfile } from '../profile/entity/userProfile.entity';
import { FriendsModule } from 'src/friend-Subscription/friends.module';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { VereficationEmail } from './entities/verefication.entity';
import { MessageUser } from 'src/social/entity/message.entity';

@Module({
  imports: [
    MailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => FriendsModule),
    TypeOrmModule.forFeature([
      User,
      UsersProfile,
      VereficationEmail,
      MessageUser,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule, FriendsModule],
})
export class UserModule {}
