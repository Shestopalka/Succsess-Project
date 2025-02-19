import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Course } from './entity/course.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([Course])],
  providers: [CourseService, JwtStrategy, JwtService],
  controllers: [CourseController],
})
export class CourseModule {}
