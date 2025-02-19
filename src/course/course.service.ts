import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Course } from './entity/course.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepositoty: Repository<Course>,
    private readonly jwtService: JwtService,
  ) {}
}
