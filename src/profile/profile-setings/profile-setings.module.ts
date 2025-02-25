import { forwardRef, Module } from '@nestjs/common';
import { ProfileSetingsController } from './profile-setings.controller';
import { ProfileSetingsService } from './profile-setings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileSetings } from '../entity/profileSetings.entity';
import { ProfileModule } from '../profile.module';

@Module({
  imports: [
    forwardRef(() => ProfileModule),
    TypeOrmModule.forFeature([ProfileSetings]),
  ],
  controllers: [ProfileSetingsController],
  providers: [ProfileSetingsService],
  exports: [ProfileSetingsService],
})
export class ProfileSetingsModule {}
