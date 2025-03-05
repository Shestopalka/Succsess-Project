import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './registrationUsers/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import * as dotenv from 'dotenv';
import { SocialModule } from './social/social.module';
import { FriendsModule } from './friend-Subscription/friends.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { S3Service } from './s3/s3.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';
import { MailModule } from './mail/mail.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/colector'),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: 'postgres',
        password: String(configService.get<string>('DB_PASSWORD')),
        database: configService.get<string>('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProfileModule,
    FriendsModule,
    AuthModule,
    CourseModule,
    SocialModule,
    MailModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, S3Service, TaskService],
  exports: [S3Service],
})
export class AppModule {}
