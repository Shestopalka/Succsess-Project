import { forwardRef, Module } from '@nestjs/common';
import { ProfileSetingsController } from './profile-setings.controller';
import { ProfileSetingsService } from './profile-setings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileSetings } from '../entity/profileSetings.entity';
import { ProfileModule } from '../profile.module';
import { UsersProfile } from '../entity/userProfile.entity';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/registrationUsers/entities/user.entity';
import { VereficationEmail } from 'src/registrationUsers/entities/verefication.entity';
import { ChangePassword } from 'src/registrationUsers/entities/changePassword.entity';
import { UserModule } from 'src/registrationUsers/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeleteUsers,
  DeleteUsersSchema,
} from 'src/registrationUsers/schema/user.schema';

@Module({
  imports: [
    MailModule,
    forwardRef(() => UserModule),
    forwardRef(() => ProfileModule),
    MongooseModule.forFeature([
      { name: DeleteUsers.name, schema: DeleteUsersSchema },
    ]),
    TypeOrmModule.forFeature([
      ProfileSetings,
      UsersProfile,
      User,
      VereficationEmail,
      ChangePassword,
    ]),
  ],
  controllers: [ProfileSetingsController],
  providers: [ProfileSetingsService],
  exports: [ProfileSetingsService],
})
export class ProfileSetingsModule {}
