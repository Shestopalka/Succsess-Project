import { forwardRef, Module } from '@nestjs/common';
import { ProfileSetingsController } from './profile-setings.controller';
import { ProfileSetingsService } from './profile-setings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileSetings } from '../entity/profileSetings.entity';
import { ProfileModule } from '../profile.module';
import { UsersProfile } from '../entity/userProfile.entity';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    MailModule,
    forwardRef(() => ProfileModule),
    TypeOrmModule.forFeature([ProfileSetings, UsersProfile, User ]),
  ],
  controllers: [ProfileSetingsController],
  providers: [ProfileSetingsService],
  exports: [ProfileSetingsService],
})
export class ProfileSetingsModule {}
